// user repository with gorm

package user_repository

import (
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"

	"gorm.io/gorm"
)

type User struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"-"`
}

// HashPassword hashes the user's password
func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func GetUserFromJwtToken(c *fiber.Ctx) (User, error) {
	user := c.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	email := claims["email"].(string)
	password := claims["password"].(string)
	return User{
		Email:    email,
		Password: password,
	}, nil
}

func GetUserByEmail(db *gorm.DB, email string) (User, error) {
	var user User
	result := db.Where("email = ?", email).First(&user)
	return user, result.Error
}

func CreateUser(db *gorm.DB, email, username, password string) (User, error) {
	hashedPassword, err := HashPassword(password)
	if err != nil {
		return User{}, err
	}
	user := User{
		Email:    email,
		Username: username,
		Password: hashedPassword,
	}
	result := db.Create(&user)
	return user, result.Error
}

func UpdateUser(db *gorm.DB, email, password string) (User, error) {
	hashedPassword, err := HashPassword(password)
	if err != nil {
		return User{}, err
	}
	user := User{
		Email:    email,
		Password: hashedPassword,
	}
	result := db.Save(&user)
	return user, result.Error
}

func DeleteUser(db *gorm.DB, email string) error {
	result := db.Where("email = ?", email).Delete(&User{})
	return result.Error
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

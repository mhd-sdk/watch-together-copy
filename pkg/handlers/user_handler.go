package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/srg-boilerplate/pkg/db"
	"github.com/srg-boilerplate/pkg/db/repositories/user_repository"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

func Login(c *fiber.Ctx) error {
	body := new(LoginRequest)
	if err := c.BodyParser(body); err != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}
	if body.Email == "" || body.Password == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{"error": "All fields are required"})
	}

	userFromDB, err := user_repository.GetUserByEmail(db.DB, body.Email)
	if err != nil {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{"error": "User with given email not found"})
	}

	isPwdValid := user_repository.CheckPasswordHash(body.Password, userFromDB.Password)
	if !isPwdValid {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{"error": "Invalid password"})
	}
	claims := jwt.MapClaims{
		"email": body.Email,
		"exp":   time.Now().Add(time.Hour * 72).Unix(),
	}

	// Create token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte("secret"))
	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{"error": "Error creating token"})
	}
	// change http code
	c.Status(fiber.StatusOK)
	return c.JSON(fiber.Map{"token": tokenString})
}

type RegisterRequest struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
}

func Register(c *fiber.Ctx) error {
	body := new(RegisterRequest)
	if err := c.BodyParser(body); err != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}
	// check if every field is filled
	if body.Email == "" || body.Username == "" || body.Password == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{"error": "All fields are required"})
	}
	_, err := user_repository.GetUserByEmail(db.DB, body.Email)
	if err == nil {
		c.Status(fiber.StatusConflict)
		return c.JSON(fiber.Map{"error": "User with given email already exists"})
	}

	_, err = user_repository.CreateUser(db.DB, body.Email, body.Username, body.Password)
	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{"error": "Error creating user"})
	}

	// change http code
	c.Status(fiber.StatusCreated)

	return c.JSON(fiber.Map{"message": "User created successfully"})

}

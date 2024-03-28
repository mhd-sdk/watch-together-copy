package db

import (
	"github.com/kr/pretty"
	"github.com/srg-boilerplate/pkg/db/repositories/user_repository"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	var user = "root"
	var password = "rootpassword"
	var host = "database"
	var db = "watchtogether"
	var dsn = user + ":" + password + "@tcp(" + host + ":3306)/" + db
	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		// if database doesnot exist, try to create it
		dsn = user + ":" + password + "@tcp(" + host + ":3306)/"
		DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
		if err != nil {
			panic("failed to connect database")
		}
		pretty.Println("DB not found, creating database...")
		DB.Exec("CREATE DATABASE " + db)
		DB.Exec("USE" + db)
		panic("failed to connect database")
	}
	DB.AutoMigrate(&user_repository.User{})
}

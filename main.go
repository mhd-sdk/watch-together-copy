package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	jwtware "github.com/gofiber/jwt/v3"
	"github.com/golang-jwt/jwt/v4"
	"github.com/srg-boilerplate/pkg/db"
	"github.com/srg-boilerplate/pkg/handlers"
	"github.com/srg-boilerplate/pkg/middlewares"
	"github.com/srg-boilerplate/pkg/room"
)

func main() {
	app := fiber.New()
	app.Use("/ws", middlewares.WebsocketMiddleware)
	app.Use(logger.New())
	app.Use(cors.New())
	app.Get("/login", handlers.Login)
	app.Get("/register", handlers.Register)
	app.Use(jwtware.New(jwtware.Config{
		SigningKey: []byte("secret"),
	}))
	roomService := room.NewRoomService()

	db.InitDB()

	app.Post("/room/", handlers.HandleNewRoom(roomService))
	app.Get("/room/:id", handlers.HandleGetRoom(roomService))
	app.Get("/room/:id/play", handlers.HandleGetRoom(roomService))
	app.Post("/room/:id/checkuniqname/", handlers.HandleCheckName(roomService))
	app.Get("/rooms", handlers.HandleGetRooms(roomService))

	app.Post("/restricted", func(c *fiber.Ctx) error {
		user := c.Locals("user").(*jwt.Token)
		claims := user.Claims.(jwt.MapClaims)
		name := claims["name"].(string)

		fmt.Printf("/restricted receive user token: %s\n", user.Raw)
		fmt.Printf("And we know that his name is: %s\n", name)

		return c.SendString("Welcome " + name + "\n")
	})

	app.Get("/ws/room/:roomID", handlers.ConnectUserToRoom(roomService))

	log.Fatal(app.Listen(":3000"))
}

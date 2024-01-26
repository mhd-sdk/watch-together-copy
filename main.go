package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/srg-boilerplate/pkg/handlers"
	"github.com/srg-boilerplate/pkg/middlewares"
	"github.com/srg-boilerplate/pkg/room"
)

func main() {
	app := fiber.New()
	app.Use("/ws", middlewares.WebsocketMiddleware)
	app.Use(logger.New())
	app.Use(cors.New())
	roomService := room.NewRoomService()

	app.Post("/room/:yturl", handlers.HandleNewRoom(roomService))
	app.Get("/room/:id", handlers.HandleGetRoom(roomService))
	app.Get("/room/:id/play", handlers.HandleGetRoom(roomService))
	app.Get("/rooms", handlers.HandleGetRooms(roomService))

	app.Get("/ws/room/:roomID", handlers.ConnectUserToRoom(roomService))

	log.Fatal(app.Listen(":3000"))
}

package handlers

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/srg-boilerplate/pkg/room"
)

func HandleNewRoom(roomService *room.RoomService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		ytURL := c.Params("yturl")
		room, err := roomService.CreateRoom(ytURL)
		if err != nil {
			return err
		}
		return c.JSON(fiber.Map{
			"room":    room,
			"message": "Room created successfully",
		})
	}
}

func HandleGetRoom(roomService *room.RoomService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		room, err := roomService.GetRoom(id)
		if err != nil {
			return err
		}
		return c.JSON(fiber.Map{
			"room":    room,
			"message": "Room retrieved successfully",
		})
	}
}

func HandleGetRooms(roomService *room.RoomService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		rooms, err := roomService.GetRooms()
		if err != nil {
			return c.JSON(fiber.Map{
				"rooms":   rooms,
				"message": err.Error(),
			})
		}
		return c.JSON(fiber.Map{
			"rooms":   rooms,
			"message": "Rooms retrieved successfully",
		})
	}
}

func ConnectUserToRoom(roomService *room.RoomService) fiber.Handler {
	return websocket.New(func(c *websocket.Conn) {
		roomService.AddClientToRoom(c)
	})
}

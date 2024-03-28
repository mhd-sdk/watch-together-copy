package handlers

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/srg-boilerplate/pkg/room"
)

type NewRoomRequestBody struct {
	YoutubeURL string `json:"youtubeUrl"`
}

func HandleNewRoom(roomService *room.RoomService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		body := new(NewRoomRequestBody)
		if err := c.BodyParser(body); err != nil {
			return err
		}
		ytURL := body.YoutubeURL
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

type checkNameBody struct {
	Name string `json:"name"`
}

func HandleCheckName(roomService *room.RoomService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		roomID := c.Params("id")
		// name is in the body
		body := new(checkNameBody)
		if err := c.BodyParser(body); err != nil {
			return err
		}
		room, err := roomService.GetRoom(roomID)
		if err != nil {
			return err
		}
		if body.Name == "" {
			return c.JSON(fiber.Map{
				"message": "Name cannot be empty",
			})
		}
		if room.Owner.Name == body.Name {
			return c.JSON(fiber.Map{
				"message": "Name already taken",
			})
		}
		for _, user := range room.Users {
			if user.Name == body.Name {
				return c.JSON(fiber.Map{
					"message": "Name already taken",
				})
			}
		}
		return c.JSON(fiber.Map{
			"message": "Name available",
		})
	}
}

func ConnectUserToRoom(roomService *room.RoomService) fiber.Handler {
	return websocket.New(func(c *websocket.Conn) {
		roomService.AddClientToRoom(c)
	})
}

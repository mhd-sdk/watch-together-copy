package room

import (
	"fmt"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber"
	"github.com/google/uuid"
)

type Room struct {
	ID                  string                   `json:"id"`
	Owner               *websocket.Conn          `json:"-"`
	Users               []string                 `json:"users"`
	CurrentYoutubeVideo string                   `json:"current_youtube_video"`
	IsPlaying           bool                     `json:"is_playing"`
	WsClients           map[*websocket.Conn]bool `json:"-"`
}

type RoomService struct {
	rooms map[string]*Room
}

func NewRoomService() *RoomService {
	newRoomService := &RoomService{
		rooms: make(map[string]*Room),
	}
	return newRoomService
}

func (s *RoomService) CreateRoom(yturl string) (*Room, error) {
	newRoom := &Room{
		ID:                  uuid.New().String(),
		Users:               []string{},
		CurrentYoutubeVideo: yturl,
	}
	if _, exists := s.rooms[newRoom.ID]; exists {
		return nil, fmt.Errorf("room with ID %s already exists", newRoom.ID)
	}
	s.rooms[newRoom.ID] = newRoom
	return newRoom, nil
}

func (s *RoomService) GetRoom(id string) (*Room, error) {
	room, exists := s.rooms[id]
	if !exists {
		return nil, fmt.Errorf("no room found with ID %s", id)
	}
	return room, nil
}

func (s *RoomService) GetRooms() ([]*Room, error) {
	var rooms []*Room
	for _, room := range s.rooms {
		rooms = append(rooms, room)
	}
	if len(rooms) == 0 {
		return []*Room{}, fmt.Errorf("no rooms found")
	}
	return rooms, nil
}

func (s *RoomService) UpdateRoom(room *Room) error {
	if _, exists := s.rooms[room.ID]; !exists {
		return fmt.Errorf("no room found with ID %s", room.ID)
	}
	s.rooms[room.ID] = room
	return nil
}

func (s *RoomService) DeleteRoom(id string) error {
	if _, exists := s.rooms[id]; !exists {
		return fmt.Errorf("no room found with ID %s", id)
	}
	delete(s.rooms, id)
	return nil
}

func (s *RoomService) AddClientToRoom(c *websocket.Conn) {
	roomID := c.Params("roomID")
	room, err := s.GetRoom(roomID)
	if err != nil {
		fmt.Println(err)
		return
	}
	// if wsClients map is nil, initialize it, and add first client as owner
	if room.WsClients == nil {
		room.WsClients = make(map[*websocket.Conn]bool)
		room.Owner = c
		c.WriteJSON(fiber.Map{
			"isOwner": true,
			"room":    room,
		})
	} else {
		room.WsClients[c] = true
		c.WriteJSON(fiber.Map{
			"room": room,
		})
	}
	for {
		_, _, err := c.ReadMessage()
		// if message contains "isPlaying", set room.IsPlaying to true

		var message map[string]interface{}
		err = c.ReadJSON(&message)

		if message["isPlaying"] != nil {
			room.IsPlaying = message["isPlaying"].(bool)
		}
		// broadcast room to all clients
		for client := range room.WsClients {
			err = client.WriteJSON(fiber.Map{
				"room": room,
			})
		}
		room.Owner.WriteJSON(fiber.Map{
			"room": room,
		})

		if err != nil {
			return
		}
	}
}

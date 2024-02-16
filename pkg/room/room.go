package room

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber"
	"github.com/google/uuid"
)

type User struct {
	Conn *websocket.Conn `json:"-"`
	Name string          `json:"name"`
}
type Room struct {
	ID             string  `json:"id"`
	Owner          User    `json:"owner"`
	YoutubeVideoID string  `json:"youtubeVideoId"`
	IsPlaying      bool    `json:"isPlaying"`
	Progress       float64 `json:"progress"`
	Users          []*User `json:"users"`
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

func (s *RoomService) CreateRoom(videoID string) (*Room, error) {
	newRoom := &Room{
		ID:             uuid.New().String(),
		YoutubeVideoID: videoID,
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

type wsMessage struct {
	ActionType     string  `json:"actionType"`
	IsPlaying      bool    `json:"isPlaying"`
	YoutubeVideoID string  `json:"youtubeVideoId"`
	Progress       float64 `json:"progress"`
	Name           string  `json:"name"`
}

func BroadCastRoom(room *Room) {
	for _, user := range room.Users {
		user.Conn.WriteJSON(fiber.Map{
			"room": room,
		})
	}
	room.Owner.Conn.WriteJSON(fiber.Map{
		"room": room,
	})
}

func (s *RoomService) AddClientToRoom(c *websocket.Conn) {
	roomID := c.Params("roomID")
	room, err := s.GetRoom(roomID)
	if err != nil {
		return
	}
	if room.Owner.Conn == nil {
		room.Owner = User{c, ""}
		c.WriteJSON(fiber.Map{
			"isOwner": true,
		})
	} else {
		room.Users = append(room.Users, &User{c, ""})
		c.WriteJSON(fiber.Map{
			"isOwner": false,
		})
	}
	BroadCastRoom(room)
	for {
		message := &wsMessage{}
		if c.Conn == nil {
			return
		}
		_, msg, err := c.ReadMessage()
		json.Unmarshal(msg, message)

		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			s.RemoveClientFromRoom(c)
			return
		}
		switch message.ActionType {
		case "changeIsPlaying":
			room.IsPlaying = message.IsPlaying
		case "changeVideo":
			room.YoutubeVideoID = message.YoutubeVideoID
		case "onProgress":
			room.Progress = message.Progress
		case "changeName":
			if room.Owner.Conn == c {
				room.Owner.Name = message.Name
			}
			for _, user := range room.Users {
				if user.Conn == c {
					user.Name = message.Name
				}
			}
		}
		BroadCastRoom(room)
	}
}

func (s *RoomService) RemoveClientFromRoom(c *websocket.Conn) {
	roomID := c.Params("roomID")
	room, err := s.GetRoom(roomID)
	if err != nil {
		fmt.Println(err)
		return
	}
	if room.Owner.Conn == c {
		s.DeleteRoom(roomID)
		return
	}
	for i, user := range room.Users {
		if user.Conn == c {
			room.Users = append(room.Users[:i], room.Users[i+1:]...)
		}
	}

	BroadCastRoom(room)
}

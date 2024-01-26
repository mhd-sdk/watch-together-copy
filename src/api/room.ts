import axios from "axios";

interface createRoomResponse {
  message: string;
  room: {
    id: string;
    users: string[];
    current_youtube_video: "";
    is_playing: false;
  };
}
export const createRoom = async (url: string): Promise<string> => {
  const response = await axios.post<createRoomResponse>(
    `http://localhost:3000/room/${url}`,
  );
  // return id of the newly created room
  return response.data.room.id;
};

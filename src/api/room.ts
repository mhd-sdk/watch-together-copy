import axios from "axios";

interface createRoomResponse {
  message: string;
  room: {
    id: string;
    users: string[];
    youtubeVideoId: "";
    isPlaying: false;
  };
}
export const createRoom = async (url: string): Promise<string> => {
  const response = await axios.post<createRoomResponse>(
    `http://localhost:3000/room`,
    {
      youtubeUrl: url,
    },
  );
  // return id of the newly created room
  return response.data.room.id;
};

export const checkName = async (
  roomId: string,
  name: string,
): Promise<string> => {
  const response = await axios.post(
    `http://localhost:3000/room/${roomId}/checkuniqname`,
    {
      name,
    },
  );
  // return id of the newly created room
  return response.data.message;
};

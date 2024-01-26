import { ReactNode, createContext, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

interface Room {
  id: string;
  users: [];
  current_youtube_video: string;
  is_playing: boolean;
}

export interface RoomContextProps {
  room?: Room;
  isOwner: boolean;
  onChangeUrl: (newUrl: string) => void;
  onChangeIsPlaying: (isPlaying: boolean) => void;
}

export const roomContext = createContext<RoomContextProps | undefined>(
  undefined,
);

interface Props {
  children?: ReactNode;
}
const RoomProvider = ({ children }: Props) => {
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [room, setRoom] = useState<Room>({
    id: "",
    users: [],
    current_youtube_video: "",
    is_playing: false,
  });
  const roomId = window.location.pathname.split("/")[2];
  const { sendMessage } = useWebSocket(
    `ws://localhost:3000/ws/room/${roomId}`,
    {
      shouldReconnect: () => true,
      onMessage: (message: any) => {
        if (!message.data) {
          return;
        }
        const isOwnerFromWs = JSON.parse(message.data).isOwner;
        if (isOwnerFromWs) {
          setIsOwner(isOwnerFromWs);
        }
        const roomFromWS = JSON.parse(message.data).room;
        if (roomFromWS) {
          console.log("data", JSON.parse(message.data));
          setRoom(roomFromWS);
        }
      },
    },
  );

  const handleChangeUrl = (newUrl: string) => {
    if (!room) {
      return;
    }
    setRoom({ ...room, current_youtube_video: newUrl });
  };

  const handleChangeIsPlaying = (isPlaying: boolean) => {
    if (!room) {
      return;
    }
    setRoom({ ...room, is_playing: isPlaying });
    sendMessage(JSON.stringify({ isPlaying: isPlaying }));
  };

  return (
    <roomContext.Provider
      value={{
        room: room,
        isOwner: isOwner,
        onChangeUrl: handleChangeUrl,
        onChangeIsPlaying: handleChangeIsPlaying,
      }}
    >
      {children}
    </roomContext.Provider>
  );
};

export default RoomProvider;

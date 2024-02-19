import { ReactNode, createContext, useState } from "react";
import useWebSocket from "react-use-websocket";

interface user {
  name: string;
}
export interface Room {
  id: string;
  users: Array<user>;
  owner: user;
  youtubeVideoId: string;
  isPlaying: boolean;
  progress: number;
}

export interface RoomContextProps {
  room?: Room;
  isOwner: boolean;
  onChangeUrl: (newUrl: string) => void;
  onChangeIsPlaying: (isPlaying: boolean) => void;
  onProgress: (progress: number) => void;
  onChangeName: (name: string) => void;
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
    youtubeVideoId: "",
    isPlaying: false,
    progress: 0,
    owner: { name: "" },
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
          console.log("room updated", roomFromWS);
          setRoom(roomFromWS);
        }
      },
    },
  );

  const handleChangeYtbID = (newUrl: string) => {
    if (!room || !isOwner) {
      return;
    }
    setRoom({ ...room, youtubeVideoId: newUrl });
  };

  const handleChangeIsPlaying = (isPlaying: boolean) => {
    if (!room || !isOwner) {
      return;
    }
    setRoom({ ...room, isPlaying });
    sendMessage(JSON.stringify({ actionType: "changeIsPlaying", isPlaying }));
  };

  const handleOnProgress = (progress: number) => {
    if (!room || !isOwner) {
      return;
    }
    setRoom({ ...room, progress: progress });
    sendMessage(JSON.stringify({ actionType: "onProgress", progress }));
  };
  const handleChangeName = (name: string) => {
    if (!room) {
      return;
    }
    sendMessage(JSON.stringify({ actionType: "changeName", name }));
  };
  return (
    <roomContext.Provider
      value={{
        room,
        isOwner,
        onChangeUrl: handleChangeYtbID,
        onChangeIsPlaying: handleChangeIsPlaying,
        onProgress: handleOnProgress,
        onChangeName: handleChangeName,
      }}
    >
      {children}
    </roomContext.Provider>
  );
};

export default RoomProvider;

import {
  RoomContextProps,
  roomContext,
} from "@/components/RoomProvider/RoomProvider";
import { useContext } from "react";

// Custom hook to access the game context
export const useRoom = (): RoomContextProps => {
  const context = useContext(roomContext);

  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }

  return context;
};

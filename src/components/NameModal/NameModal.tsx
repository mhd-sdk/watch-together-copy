import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "../ui/alert-dialog";
import { Input } from "../ui/input";
import { Room } from "../RoomProvider/RoomProvider";
import { css } from "@emotion/css";
import { ReloadIcon } from "@radix-ui/react-icons";
import { checkName } from "@/api/room";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toaster, toast } from "sonner";

interface Props {
  room: Room;
  isOwner: boolean;
  isModalOpen: boolean;
  onContinue: (name: string) => void;
}

export const NameModal = ({
  room,
  isOwner,
  isModalOpen,
  onContinue,
}: Props): JSX.Element => {
  const [inputValue, setInputValue] = useState("");
  const [hasBeenEdited, setHasBeenEdited] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [isNameAvailable, setIsNameAvailable] = useState(false);

  useEffect(() => {
    if (isOwner) {
      toast("Room created successfully", {
        description:
          "You created a room, you are now the host, if you leave the room will be closed.",
        action: {
          label: "OK",
          onClick: () => {},
        },
      });
    } else {
      toast("Room joined successfully", {
        description: "You have joined the room.",
        action: {
          label: "OK",
          onClick: () => {},
        },
      });
    }
  }, []);

  useEffect(() => {
    const debounceId = setTimeout(() => {
      checkName(room.id, inputValue).then((res) => {
        switch (res) {
          case "Name cannot be empty":
            setIsNameAvailable(false);
            break;
          case "Name already taken":
            setIsNameAvailable(false);
            break;
          case "Name available":
            setIsNameAvailable(true);
            break;
        }
        setIsDebouncing(false);
      });
    }, 1000);

    return () => {
      clearTimeout(debounceId);
    };
  }, [inputValue]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDebouncing(true);
    setInputValue(e.target.value);
    setHasBeenEdited(true);
  };

  const renderNameError = () => {
    if (isDebouncing) {
      return <span>Checking name availability...</span>;
    }
    if (inputValue.length === 0) {
      return (
        <span
          className={css`
            color: red;
          `}
        >
          Name cannot be empty
        </span>
      );
    }
    if (!isNameAvailable) {
      return (
        <span
          className={css`
            color: red;
          `}
        >
          Name already taken
        </span>
      );
    }
    return "checking name availability...";
  };
  return (
    <AlertDialog open={isModalOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Joining room...</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to join a room please enter your name to continue{" "}
            <br />
            <span
              className={css`
                color: red;
              `}
            >
              {isOwner &&
                "You are the owner of this room, if you leave the room will be closed."}
            </span>
          </AlertDialogDescription>
          <Input value={inputValue} onChange={handleInput} />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Tooltip open={hasBeenEdited && (!isNameAvailable || isDebouncing)}>
            <TooltipTrigger asChild>
              <AlertDialogAction
                disabled={!isNameAvailable || isDebouncing}
                onClick={() => onContinue(inputValue)}
              >
                Continue
                {isDebouncing && (
                  <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />
                )}
              </AlertDialogAction>
            </TooltipTrigger>
            <TooltipContent>{renderNameError()}</TooltipContent>
          </Tooltip>
        </AlertDialogFooter>
      </AlertDialogContent>
      <Toaster />
    </AlertDialog>
  );
};

import { useEffect, useRef, useState } from "react";
import { useRoom } from "@/hooks/useRoom";
import { css } from "@emotion/css";
import ReactPlayer from "react-player";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { NameModal } from "@/components/NameModal/NameModal";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {}

export const Room = ({}: Props): JSX.Element => {
  const { room, isOwner, onChangeIsPlaying, onProgress, onChangeName } =
    useRoom();

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [previousProgress, setPreviousProgress] = useState<number>(
    room?.progress || 0,
  );
  const reactPlayer = useRef<ReactPlayer>();
  useEffect(() => {
    if (!room) {
      return;
    }
    if (Math.abs(previousProgress - room?.progress) >= 3) {
      reactPlayer.current?.seekTo(room?.progress, "seconds");
      setPreviousProgress(room?.progress);
    }
  }, [room?.progress]);

  const handlePlay = () => {
    onChangeIsPlaying(true);
  };

  const handlePause = () => {
    onChangeIsPlaying(false);
  };

  const onPlayerReady = (player: ReactPlayer) => {
    if (!player) {
      return;
    }
    reactPlayer.current = player;
    reactPlayer.current.seekTo(room?.progress ?? 0, "seconds");
  };

  const handleOnProgress = (progress: number) => {
    onProgress(progress);
  };

  const handleEnter = (name: string) => {
    setIsModalOpen(false);
    onChangeName(name);
  };
  return (
    <>
      {room && (
        <NameModal
          isModalOpen={isModalOpen}
          room={room}
          isOwner={isOwner}
          onContinue={handleEnter}
        />
      )}

      <div className={styles.wrapper}>
        <div className={styles.youtubeWrapper}>
          <div className={styles.roomUsers}>
            {room?.owner && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar>
                    <AvatarImage
                      src="https://i.pravatar.cc/150?img=0"
                      alt="@shadcn"
                    />
                    <AvatarFallback>{room.owner.name}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>{`${room.owner.name} [OWNER]`}</TooltipContent>
              </Tooltip>
            )}
            {room?.users &&
              room?.users.map((user, idx) => (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar>
                      <AvatarImage
                        src={`https://i.pravatar.cc/150?img=${idx + 1}`}
                      />
                      <AvatarFallback>{user.name}</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    {user.name === ""
                      ? "user is choosing a name..."
                      : user.name}
                  </TooltipContent>
                </Tooltip>
              ))}
          </div>
          {`https://www.youtube.com/watch?v=${room?.youtubeVideoId}`}
          <ReactPlayer
            playing={room?.isPlaying}
            onReady={onPlayerReady}
            onPause={handlePause}
            onPlay={handlePlay}
            onProgress={(progress) => handleOnProgress(progress.playedSeconds)}
            controls={true}
            url={`https://www.youtube.com/watch?v=${room?.youtubeVideoId}`}
          />
          {/* {!isOwner && <div className={styles.overlay} />} */}
          {`is owner: ${isOwner}`}
        </div>
      </div>
    </>
  );
};

const styles = {
  wrapper: css`
    padding: 20px;
  `,
  youtubeWrapper: css``,
  roomUsers: css`
    display: flex;
    flex-direction: row;
    gap: 10px;
  `,
  overlay: css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  `,
};

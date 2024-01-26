import { useRef, useState } from "react";
import { useRoom } from "@/hooks/useRoom";
import { css } from "@emotion/css";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { Options } from "youtube-player/dist/types";

interface Props {}

export const Room = ({}: Props): JSX.Element => {
  const { room, isOwner, onChangeIsPlaying } = useRoom();

  const youtubePlayer = useRef<YouTubePlayer>();

  const handlePlay = () => {
    onChangeIsPlaying(true);
  };

  const handlePause = () => {
    onChangeIsPlaying(false);
  };

  const onPlayerReady = (event: YouTubeEvent) => {
    if (!event) {
      return;
    }
    youtubePlayer.current = event.target;
  };
  const opts: Options = {
    playerVars: {
      controls: isOwner ? undefined : 0,
    },
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.youtubeWrapper}>
        {isOwner && "you are the owner"}
        --
        {room?.current_youtube_video}
        <YouTube
          onReady={onPlayerReady}
          videoId={room?.current_youtube_video}
          opts={opts}
          onPlay={handlePlay}
          onPause={handlePause}
        />
        {room?.is_playing ? "isPlaying" : "isNotPlaying"}
        {!isOwner && <div className={styles.overlay} />}
      </div>
    </div>
  );
};

const styles = {
  wrapper: css``,
  youtubeWrapper: css`
    position: relative;
    width: 640px;
    height: 390px;
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

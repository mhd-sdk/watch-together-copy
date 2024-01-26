import { useRef, useState } from "react";
import { useRoom } from "@/hooks/useRoom";
import { css } from "@emotion/css";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { Options } from "youtube-player/dist/types";

interface Props {}

export const Room = ({}: Props): JSX.Element => {
  const { room, isOwner, onChangeIsPlaying, onChangeUrl } = useRoom();
  const [isPlaying, setIsPlaying] = useState(false);
  const youtubePlayer = useRef<YouTubePlayer>();

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
  const togglePlayback = () => {
    if (isPlaying && youtubePlayer) {
      youtubePlayer.current?.pauseVideo();
      setIsPlaying(false);
    } else {
      youtubePlayer.current?.playVideo();
      setIsPlaying(true);
    }
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.youtubeWrapper}>
        <YouTube
          onReady={onPlayerReady}
          videoId={"NxxW1AqoMmE"}
          opts={opts}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnd={() => setIsPlaying(false)}
        />
        <div className={styles.overlay} onClick={togglePlayback}></div>
      </div>
      <button onClick={togglePlayback}>{isPlaying ? "Pause" : "Play"}</button>
    </div>
  );
};

const styles = {
  wrapper: css``,
  youtubeWrapper: css`
    position: relative;
    width: 640px; /* Same as YouTube player width */
    height: 390px; /* Same as YouTube player height */
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

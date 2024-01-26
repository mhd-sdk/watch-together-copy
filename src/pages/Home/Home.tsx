import { Button } from "@/components/ui/button";
import imageurl from "../../resources/home-image.png";
import { css } from "@emotion/css";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";
import { createRoom } from "@/api/room";
interface Props {}

export const Home = ({}: Props): JSX.Element => {
  const [url, setUrl] = useState("");
  const [isUrlValid, setIsUrlValid] = useState(true);
  const handleYoutubeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUrlValid(true);
    setUrl(e.target.value);
  };
  const navigate = useNavigate();
  const handleSubmit = async () => {
    if (!url.includes("youtube.com") || url.length === 0) {
      setIsUrlValid(false);
      return;
    }
    setIsUrlValid(true);
    // Requêter un utilisateur avec un ID donné.

    const roomId = await createRoom(url.split("v=")[1]);

    navigate(`/room/${roomId}`);
  };
  return (
    <div id="home-wrapper" className={styles.wrapper}>
      <img alt="" src={imageurl} className={styles.image} />

      <div className={styles.flex}>
        <h1 className={styles.title}>
          Watch videos with your friends in real time
        </h1>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            value={url}
            onChange={handleYoutubeUrl}
            placeholder="paste your youtube link here"
          />
          <Tooltip open={!isUrlValid}>
            <TooltipTrigger asChild>
              <Button onClick={handleSubmit} disabled={!isUrlValid}>
                Create room
              </Button>
            </TooltipTrigger>
            <TooltipContent className="">
              Url must be a valid youtube video
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

const styles = {
  flex: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
  `,
  wrapper: css`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  `,
  image: css`
    width: 80%;
    object-fit: contain;
    margin: 0 auto;
  `,
  title: css`
    font-size: 3rem;
    font-weight: 600;
    line-height: 2rem;
    margin: 0;
  `,
};

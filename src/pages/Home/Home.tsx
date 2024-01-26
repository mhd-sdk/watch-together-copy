import { Button } from "@/components/ui/button";
import imageurl from "../../resources/home-image.png";
import { css } from "@emotion/css";
import { Input } from "@/components/ui/input";
interface Props {}

export const Home = ({}: Props): JSX.Element => {
  return (
    <div id="home-wrapper" className={styles.wrapper}>
      <img alt="" src={imageurl} className={styles.image} />

      <div className={styles.flex}>
        <h1 className={styles.title}>
          Watch videos with your friends in real time
        </h1>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="email" placeholder="paste a link to a video" />
          <Button type="submit">Create room</Button>
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

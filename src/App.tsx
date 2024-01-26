import { css } from "@emotion/css";
import { Home } from "./pages/Home/Home";
import { Room } from "./pages/Room/Room";
import { Navbar } from "./components/navbar/Navbar";
import { TooltipProvider } from "./components/ui/tooltip";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RoomProvider from "./components/RoomProvider/RoomProvider";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/room/:roomID",
      element: (
        <RoomProvider>
          <Room />
        </RoomProvider>
      ),
    },
  ]);
  return (
    <TooltipProvider>
      <div className={styles.wrapper}>
        <Navbar />
        <RouterProvider router={router} />
      </div>
    </TooltipProvider>
  );
};

const styles = {
  wrapper: css`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    padding: 10px;
  `,
};

export default App;

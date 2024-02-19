import { css } from "@emotion/css";
import { Home } from "./pages/Home/Home";
import { Room } from "./pages/Room/Room";
import { Navbar } from "./components/Navbar/Navbar";
import { TooltipProvider } from "./components/ui/tooltip";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RoomProvider from "./components/RoomProvider/RoomProvider";
import { RoomNavbar } from "./components/RoomNavbar/RoomNavbar";

const App = () => {
  const pathName = window.location.pathname;
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
        {pathName === "/" && <Navbar />}
        {pathName.includes("room") && <RoomNavbar />}
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

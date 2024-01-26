import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { Navbar } from "./components/navbar/Navbar";
import { css } from "@emotion/css";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
  ]);
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <RouterProvider router={router} />
    </div>
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

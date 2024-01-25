import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./../app/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
const root = window.document.documentElement;
root.classList.add("dark");

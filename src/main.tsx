import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./../app/globals.css";
import "./../app/main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
const root = window.document.documentElement;
const isDark = localStorage.getItem("watchtogetherynov-isdarkmode") === "true";
console.log(localStorage.getItem("watchtogetherynov-isdarkmode"));
if (isDark === null) {
  root.classList.add("dark");
  localStorage.setItem("watchtogetherynov-isdarkmode", "true");
} else {
  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.add("light");
  }
}

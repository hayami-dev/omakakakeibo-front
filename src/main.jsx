import { StrictMode } from "react"; // 決まり文句、2回実行のテストをしてくれる
import { Provider } from "jotai";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./styles/main.css";
import App from "@/App.jsx";

const root = createRoot(document.getElementById("root"));
root.render(
  <Provider>
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  </Provider>,
);

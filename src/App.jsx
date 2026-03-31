import "./App.css";
import Home from "./components/Home";
import InputForm from "./components/InputForm";
import { Route, Routes } from "react-router";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path="input" element={<InputForm />} />
      </Route>
    </Routes>
  );
}

export default App;

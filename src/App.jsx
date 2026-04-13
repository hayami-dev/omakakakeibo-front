import "./App.css";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import InputForm from "./pages/InputForm";
// import User from "./pages/User";
// import Categories from "./pages/user/Categories";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <Routes>
        {/* ホーム */}
        <Route path="/" element={<Home />}>
          {/* ダイアログ */}
          <Route path="input" element={<InputForm />} />
        </Route>
        {/* ユーザーページ */}
        {/* <Route path="user" element={<User />} />
        <Route path="user/categories" element={<Categories />} /> */}
      </Routes>
    </>
  );
}

export default App;

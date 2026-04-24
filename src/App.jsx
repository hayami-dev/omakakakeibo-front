import "./App.css";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import InputForm from "./pages/InputForm";
import User from "./pages/User";
import CategoryEdit from "./pages/user/CategoryEdit";
import Header from "./components/Header";
import BudgetEdit from "./pages/user/BudgetEdit";

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
        <Route path="user" element={<User />} />
        <Route path="user/categoryEdit" element={<CategoryEdit />} />
        <Route path="user/budgetEdit" element={<BudgetEdit />} />
      </Routes>
    </>
  );
}

export default App;

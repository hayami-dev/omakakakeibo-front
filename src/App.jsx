import { useEffect } from "react";
import { useSetAtom } from "jotai";
// ルート
import "./App.css";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import InputForm from "./pages/InputForm";
import User from "./pages/User";
import CategoryEdit from "./pages/user/CategoryEdit";
import Header from "./components/Header";
import BudgetEdit from "./pages/user/BudgetEdit";
// DBからカテゴリを取得
import {
  activeCategoriesAtom,
  categoryService,
} from "./service/categoryService";

function App() {
  const setActiveCategories = useSetAtom(activeCategoriesAtom);
  useEffect(() => {
    const loadData = async () => {
      // JavaAPIを叩いて加工済みデータを取得
      // userId：1
      const data = await categoryService.fetchActiveCategories(1);

      // 取得したデータをAtomに保存
      setActiveCategories(data);
    };
    loadData();
  }, [setActiveCategories]); // 第2引数を空にすると初回のみ実行になる

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

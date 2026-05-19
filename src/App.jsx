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
  categoriesMasterAtom,
  categoryService,
} from "./service/categoryService";
import { historiesAtom, historyService } from "./service/historyService";

function App() {
  const USER_ID = 1;

  const setActiveCategories = useSetAtom(activeCategoriesAtom);
  const setCategoriesMaster = useSetAtom(categoriesMasterAtom);
  const setHistories = useSetAtom(historiesAtom);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // JavaAPIを叩いて加工済みデータを取得
        // userId：1
        const [activeData, masterData, historyData] = await Promise.all([
          categoryService.fetchActiveCategories(USER_ID),
          categoryService.fetchCategoriesMaster(USER_ID),
          historyService.fetchHistories(USER_ID),
        ]);

        // 取得したデータをAtomに保存
        setActiveCategories(activeData);
        setCategoriesMaster(masterData);
        setHistories(historyData);

        console.log("データロード完了:", {
          activeData,
          masterData,
          historyData,
        });
      } catch (error) {
        console.log("初期データのロードに失敗しました", error);
      }
    };
    loadInitialData();
  }, [setActiveCategories, setCategoriesMaster, setHistories]); // 第2引数を空にすると初回のみ実行になる

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

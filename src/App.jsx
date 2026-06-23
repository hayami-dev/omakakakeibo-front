import { useEffect, useState } from "react";
import { useSetAtom, useAtomValue } from "jotai";
// ルート
import { Route, Routes, useNavigate } from "react-router";
import Home from "@/pages/Home";
import InputHistory from "@/pages/InputHistory";
import User from "@/pages/User";
import CategoryEdit from "@/pages/user/CategoryEdit";
import Header from "@/components/Header";
import BudgetEdit from "@/pages/user/BudgetEdit";
// DBからカテゴリを取得
import {
  activeCategoriesAtom,
  categoriesMasterAtom,
  categoryService,
} from "@/service/categoryService";
import { historiesAtom, historyService } from "@/service/historyService";
import { userIdAtom } from "@/service/authService";
// component
import Toast from "@/components/ui/Toast";
import LoadingAnime from "./components/ui/LoadingAnime/LoadingAnime";

function App() {
  const USER_ID = useAtomValue(userIdAtom);

  const setActiveCategories = useSetAtom(activeCategoriesAtom);
  const setCategoriesMaster = useSetAtom(categoriesMasterAtom);
  const setHistories = useSetAtom(historiesAtom);

  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingDOM, setShowLoadingDOM] = useState(true);

  // 初回アクセス時、読み込みを待ってからInputHistoryを表示
  const navigate = useNavigate();
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // ローディングアニメを表示
        setIsLoading(true);
        setShowLoadingDOM(true);

        // JavaAPIを叩いて加工済みデータを取得
        // 指定したミリ秒（ms）だけ処理を待たせる関数
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        // JavaAPIの通信と一緒に「2秒待つ処理」を並行して実行させる
        const [activeData, masterData, historyData] = await Promise.all([
          categoryService.fetchActiveCategories(USER_ID),
          categoryService.fetchCategoriesMaster(USER_ID),
          historyService.fetchHistories(USER_ID),
          delay(2000), // 2000ms（2秒）のウェイト
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
      } finally {
        setIsLoading(false);

        // アニメーションが終わる時間（500ms）だけ待ってから、DOMから完全に消す
        setTimeout(() => {
          setShowLoadingDOM(false);
        }, 500);
      }
    };
    loadInitialData();
  }, [setActiveCategories, setCategoriesMaster, setHistories]); // 第2引数を空にすると初回のみ実行になる

  // 初回アクセス時のみ、InputHistoryを自動で表示
  useEffect(() => {
    if (!showLoadingDOM && !hasAutoOpened) {
      setHasAutoOpened(true);
      navigate("input");
    }
  }, [showLoadingDOM, hasAutoOpened, navigate]);

  return (
    <>
      {showLoadingDOM && (
        <div
          className={`fixed inset-0 top-0 w-full f-full bg-bg flex items-center justify-center transition-opacity duration-500 ease-out z-[999]
            ${isLoading ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
          <LoadingAnime />
        </div>
      )}
      <Header />
      <Toast />
      <Routes>
        {/* ホーム */}
        <Route path="/" element={<Home />}>
          {/* ダイアログ */}
          <Route
            path="input"
            element={!showLoadingDOM ? <InputHistory /> : null}
          />
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

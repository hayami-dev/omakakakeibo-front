import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  currentMonthAtom,
  historiesAtom,
  historyService,
} from "./service/historyService";
import { useEffect, useState } from "react";
import {
  activeCategoriesAtom,
  categoriesMasterAtom,
  categoryService,
} from "./service/categoryService";
import { budgetService, monthlyBudgetAtom } from "./service/budgetService";
import { userIdAtom } from "./service/authService";
import Header from "./components/Header";
import { Outlet } from "react-router";
import LoadingAnime from "./components/ui/LoadingAnime";

export default function MainLayout() {
  // ユーザーIDを取得
  const userId = useAtomValue(userIdAtom);

  // 選択中の月
  const currentMonth = useAtomValue(currentMonthAtom);

  const setHistories = useSetAtom(historiesAtom);

  // 各Atomの取得
  const setMonthlyBudget = useSetAtom(monthlyBudgetAtom);
  const setActiveCategories = useSetAtom(activeCategoriesAtom);
  const setCategoriesMaster = useSetAtom(categoriesMasterAtom);

  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingDOM, setShowLoadingDOM] = useState(true);

  const [firstAccess, setFirstAccess] = useState(true);

  // DBから各種初期データと目標金額を取得
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // ローディングアニメを表示
        setIsLoading(true);
        setShowLoadingDOM(true);

        // 指定したミリ秒（ms）だけ処理を待たせる関数
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        // JavaAPIの通信と一緒に「2秒待つ処理」を並行して実行させる
        const [activeData, masterData, historyData] = await Promise.all([
          categoryService.fetchActiveCategories(),
          categoryService.fetchCategoriesMaster(),
          historyService.fetchHistories(),
          delay(2000), // 2000ms（2秒）のウェイト
        ]);

        // 取得したデータをAtomに保存
        setActiveCategories(activeData);
        setCategoriesMaster(masterData);
        setHistories(historyData);

        console.log("カテゴリ・履歴データロード完了:", {
          activeData,
          masterData,
          historyData,
        });

        // 目標金額の取得
        const amount = await budgetService.loadBudgetWithFallback(currentMonth);
        setMonthlyBudget(amount);

        console.log("目標金額ロード完了:", amount);
      } catch (error) {
        console.error("初期データのロードに失敗しました", error);
      } finally {
        // データロード完了のフラグだけ先に立てる
        setIsLoading(false);

        // データロード完了から 500ms 待ってからDOMごと消す
        setTimeout(() => {
          setShowLoadingDOM(false);
          // ここで初回アクセス判定を false にする（遷移のタイミングに合わせる）
          setFirstAccess(false);
        }, 500);
      }
    };

    loadInitialData();
  }, [
    userId,
    currentMonth,
    setActiveCategories,
    setCategoriesMaster,
    setHistories,
    setMonthlyBudget,
  ]);

  return (
    <>
      <Header />
      {/* ローディングアニメーション */}
      {showLoadingDOM && firstAccess && (
        <div
          className={`fixed inset-0 top-0 w-full h-full bg-bg flex items-center justify-center transition-opacity duration-500 ease-out z-[999]
                      ${isLoading ? "opacity-100" : "opacity-0 pointer-events-none"}
                    `}
        >
          <LoadingAnime />
        </div>
      )}
      <Outlet /> {/* ここにHomeやUserが差し込まれる */}
    </>
  );
}

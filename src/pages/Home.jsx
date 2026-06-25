/* ユーザーが最初に訪れるホーム画面 */

import { useEffect, useState } from "react";
import { useAtom, useSetAtom, useAtomValue } from "jotai";
import { Outlet } from "react-router";
/*
 * utils */
import { getYearMonth } from "@/dateUtils";
/**
 * components
 */
import Summary from "@/components/home/Summary";
import HistoryList from "@/components/home/HistoryList";
import CategorySummary from "@/components/home/CategorySummary";
import MonthSummary from "@/components/home/MonthSummary";
import Footer from "@/components/Footer";
import LoadingAnime from "@/components/ui/LoadingAnime";

/**
 * service
 */
import {
  currentMonthAtom,
  historiesAtom,
  historyService,
} from "@/service/historyService";
import { budgetService, monthlyBudgetAtom } from "@/service/budgetService";
import { userIdAtom } from "@/service/authService";
import {
  activeCategoriesAtom,
  categoriesMasterAtom,
  categoryService,
} from "@/service/categoryService";

export default function Home() {
  // ユーザーIDを取得
  const userId = useAtomValue(userIdAtom);

  // 選択中の月
  const [currentMonth, setCurrentMonth] = useAtom(currentMonthAtom);

  // 各Atomの取得
  const setMonthlyBudget = useSetAtom(monthlyBudgetAtom);
  const setActiveCategories = useSetAtom(activeCategoriesAtom);
  const setCategoriesMaster = useSetAtom(categoriesMasterAtom);
  const setHistories = useSetAtom(historiesAtom);

  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingDOM, setShowLoadingDOM] = useState(true);

  // Home画面に戻ってきた時に今月にリセットする
  useEffect(() => {
    const thisMonth = getYearMonth();
    setCurrentMonth(thisMonth);
  }, [setCurrentMonth]);

  // DBから各種初期データと目標金額を取得
  useEffect(() => {
    const loadInitialData = async () => {
      // userIdが無い、または"undefined"（文字列）の場合は通信を完全にブロックする
      if (!userId || userId === "undefined") {
        return;
      }

      try {
        // ローディングアニメを表示
        setIsLoading(true);
        setShowLoadingDOM(true);

        // 指定したミリ秒（ms）だけ処理を待たせる関数
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        // JavaAPIの通信と一緒に「2秒待つ処理」を並行して実行させる
        const [activeData, masterData, historyData] = await Promise.all([
          categoryService.fetchActiveCategories(userId),
          categoryService.fetchCategoriesMaster(userId),
          historyService.fetchHistories(userId),
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
        const amount = await budgetService.loadBudgetWithFallback(
          userId,
          currentMonth,
        );
        setMonthlyBudget(amount);

        console.log("目標金額ロード完了:", amount);
      } catch (error) {
        console.error("初期データのロードに失敗しました", error);
      } finally {
        setIsLoading(false);

        // アニメーションが終わる時間（500ms）だけ待ってから、DOMから完全に消す
        setTimeout(() => {
          setShowLoadingDOM(false);
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

  // 初回アクセス時、読み込みを待ってからInputHistoryを表示
  // const navigate = useNavigate();
  // const [hasAutoOpened, setHasAutoOpened] = useState(false);

  // 初回アクセス時のみ、InputHistoryを自動で表示
  // useEffect(() => {
  //   if (!showLoadingDOM && !hasAutoOpened) {
  //     setHasAutoOpened(true);
  //     navigate("input");
  //   }
  // }, [showLoadingDOM, hasAutoOpened, navigate]);

  return (
    <>
      {/* ローディングアニメーション */}
      {showLoadingDOM && (
        <div
          className={`fixed inset-0 top-0 w-full h-full bg-bg flex items-center justify-center transition-opacity duration-500 ease-out z-[999]
                ${isLoading ? "opacity-100" : "opacity-0 pointer-events-none"}
              `}
        >
          <LoadingAnime />
        </div>
      )}
      <main className="flex flex-col gap-5 pt-6 pb-16">
        {/* 各月の合計金額、目標金額の表示 */}
        <Summary />
        <MonthSummary />
        {/* 各月の支出の詳細を表示 */}
        <div className="bg-bg p-4">
          <h2>きろくの明細</h2>
        </div>
        <CategorySummary />
        <HistoryList />
        {/* InputFormをHome内に表示する */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

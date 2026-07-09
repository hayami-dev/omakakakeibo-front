/* ユーザーが最初に訪れるホーム画面 */

import { useEffect } from "react";
import { useSetAtom } from "jotai";
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
import { currentMonthAtom } from "@/service/historyService";

export default function Home() {
  // 選択中の月
  const setCurrentMonth = useSetAtom(currentMonthAtom);

  // Home画面に戻ってきた時に今月にリセットする
  useEffect(() => {
    const thisMonth = getYearMonth();
    setCurrentMonth(thisMonth);
  }, [setCurrentMonth]);

  return (
    <>
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

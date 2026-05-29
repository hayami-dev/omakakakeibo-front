/* ユーザーが最初に訪れるホーム画面 */

import { useEffect } from "react";
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
/**
 * service
 */
import { currentMonthAtom } from "@/service/historyService";
import { budgetService, monthlyBudgetAtom } from "@/service/budgetService";
import { userIdAtom } from "@/service/authService";

export default function Home() {
  // ユーザーIDを取得
  const USER_ID = useAtomValue(userIdAtom);

  // 選択中の月
  const [currentMonth, setCurrentMonth] = useAtom(currentMonthAtom);

  // 目標金額の取得
  const setMonthlyBudget = useSetAtom(monthlyBudgetAtom);

  // Home画面に戻ってきた時に今月にリセットする
  useEffect(() => {
    const thisMonth = getYearMonth();
    setCurrentMonth(thisMonth);
  }, [setCurrentMonth]);

  // DBから目標金額を取得
  useEffect(() => {
    const loadBudget = async () => {
      const amount = await budgetService.loadBudgetWithFallback(
        USER_ID,
        currentMonth,
      );
      setMonthlyBudget(amount);
    };
    loadBudget();
  }, [currentMonth]);

  return (
    <>
      <main className="flex flex-col gap-5 pt-space-500 pb-space-800">
        {/* 各月の合計金額、目標金額の表示 */}
        <Summary />
        <MonthSummary />
        {/* 各月の支出の詳細を表示 */}
        <div className="bg-bg p-space-400">
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

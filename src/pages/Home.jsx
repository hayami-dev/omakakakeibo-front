/* ユーザーが最初に訪れるホーム画面 */

import { useEffect } from "react";
import { useAtom, useSetAtom, useAtomValue } from "jotai";
import { NavLink, Outlet } from "react-router";
/**
 * components
 */
import Summary from "@/components/home/Summary";
import HistoryList from "@/components/home/HistoryList";
import CategorySummary from "@/components/home/CategorySummary";
import SelectMonth from "@/components/home/SelectMonth";
import MonthSummary from "@/components/home/MonthSummary";
/**
 * service
 */
import { currentMonthAtom } from "@/service/historyService";
import { budgetService, monthlyBudgetAtom } from "@/service/budgetService";
import { userIdAtom } from "@/service/authService";
import { getYearMonth } from "@/dateUtils";

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
  }, [setCurrentMonth]); // 👈 目的が「月のリセット」なので、ここで一旦完結させる

  // DBから目標金額を取得
  useEffect(() => {
    const loadBudget = async () => {
      const budget = await budgetService.fetchMonthlyBudget(
        USER_ID,
        currentMonth,
      );
      setMonthlyBudget(budget);
    };

    loadBudget();
  }, [currentMonth, setMonthlyBudget]);

  return (
    <main>
      <h1>おおまか家計簿</h1>
      <nav>
        <NavLink to="/input">📝 入力</NavLink>
      </nav>
      {/* 各月の合計金額、目標金額の表示 */}
      <section>
        <SelectMonth />
        <Summary />
        <MonthSummary />
      </section>
      {/* 各月の支出の詳細を表示 */}
      <section>
        <CategorySummary />
        <HistoryList />
      </section>
      {/* InputFormをHome内に表示する */}
      <Outlet />
    </main>
  );
}

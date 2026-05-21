import { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { NavLink, Outlet, useNavigate } from "react-router";
/**
 * utils
 */
import { getYearMonth, getRecentMonthsRange } from "../dateUtils";
/**
 * components
 */
import Summary from "../components/home/Summary";
import HistoryList from "../components/home/HistoryList";
import CategorySummary from "../components/home/CategorySummary";
import SelectMonth from "../components/home/SelectMonth";
import MonthSummary from "../components/home/MonthSummary";
/**
 * service
 */
import {
  historiesAtom,
  filterHistoryByMonths,
} from "../service/historyService";
import { budgetService, monthlyBudgetAtom } from "../service/budgetService";
import { userIdAtom } from "../authService";

export default function Home() {
  // ユーザーIDを取得
  const USER_ID = useAtomValue(userIdAtom);

  // 支出の履歴を取得
  const [histories] = useAtom(historiesAtom);

  // 選択中の月
  const [selectMonth, setSelectMonth] = useState(getYearMonth());

  // 目標金額の取得
  const [monthlyBudget, setMonthlyBudget] = useAtom(monthlyBudgetAtom);

  // DBから目標金額を取得
  useEffect(() => {
    const loadBudget = async () => {
      const budget = await budgetService.fetchMonthlyBudget(
        USER_ID,
        selectMonth,
      );
      setMonthlyBudget(budget);
    };

    loadBudget();
  }, [selectMonth, setMonthlyBudget]);

  // 表示中の月を切り替え
  const changeDisplayMonth = (yearMonth) => {
    setSelectMonth(yearMonth);
  };

  // histories
  const selectFilteredHistory = selectMonth
    ? histories.filter((item) => item?.historyDate.startsWith(selectMonth))
    : histories; // 何も選ばれてなければ今月

  // フィルタリングした内容の合計値を出す
  const filteredTotal = selectFilteredHistory.reduce(
    (acc, cur) => acc + cur.amount,
    0,
  );

  // historyを6ヶ月間に絞り込む
  const targetMonth = getRecentMonthsRange();
  const targetFilteredHistory = filterHistoryByMonths(histories, targetMonth);

  const navigate = useNavigate();
  const onEdit = (targetId) => {
    const targetHistoryItem = histories.find(
      (item) => item.historyId === targetId,
    );

    navigate("/input", {
      state: { item: targetHistoryItem },
    });
  };

  return (
    <main>
      <h1>おおまか家計簿</h1>
      <nav>
        <NavLink to="/input">📝 入力</NavLink>
        <SelectMonth
          changeDisplayMonth={changeDisplayMonth}
          targetMonth={targetMonth}
        ></SelectMonth>
      </nav>
      {/* 結果表示 */}
      <section>
        <Summary
          histories={histories}
          selectMonth={selectMonth}
          monthlyBudget={monthlyBudget}
        />
      </section>
      <section>
        <p>フィルター後</p>
        <HistoryList history={selectFilteredHistory} onEdit={onEdit} />
        <CategorySummary history={selectFilteredHistory} />
        <MonthSummary
          history={targetFilteredHistory}
          monthlyBudget={monthlyBudget}
          selectMonth={selectMonth}
          targetMonth={targetMonth}
        />
      </section>
      {/* InputFormのコンテキスト */}
      <Outlet />
    </main>
  );
}

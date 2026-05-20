import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { NavLink, Outlet, useNavigate } from "react-router";
import { getYearMonth } from "../dateUtils";
import Summary from "../components/Summary";
import HistoryList from "../components/HistoryList";
import CategorySummary from "../components/CategorySummary";
import SelectMonth from "../components/SelectMonth";
import MonthSummary from "../components/MonthSummary";
import {
  historiesAtom,
  createHistoryItem,
  filterHistoryByMonths,
} from "../service/historyService";
import { budgetService, monthlyBudgetAtom } from "../service/budgetService";
import { getRecentMonthsRange } from "../dateUtils";

export default function Home() {
  // TODO:リファクタリングで消す ユーザーID
  const USER_ID = 1;

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
          total={filteredTotal}
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
      <Outlet
        context={{
          onSend: (amount, categoryId, inputDate) => {
            const newItem = createHistoryItem(amount, categoryId, inputDate);
            // updateAndSaveHistory([...history, newItem]);
          },
          onUpdate: (editItemId, amount, selectCategoryId, inputDate) => {
            const newHistory = history.map((item) =>
              item.id === editItemId
                ? createHistoryItem(
                    amount,
                    selectCategoryId,
                    inputDate,
                    editItemId,
                  )
                : item,
            );
            // updateAndSaveHistory(newHistory);
          },
          onRemove: (editItemId) => {
            updateAndSaveHistory(
              history.filter((item) => item.id !== editItemId),
            );
          },
        }}
      />
    </main>
  );
}

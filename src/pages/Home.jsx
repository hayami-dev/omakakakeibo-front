import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { getYearMonth } from "../dateUtils";
import { getDummyData, getDummySummary } from "../dummyData";
import Summary from "../components/Summary";
import HistoryList from "../components/HistoryList";
import CategorySummary from "../components/CategorySummary";
import SelectMonth from "../components/SelectMonth";
import MonthSummary from "../components/MonthSummary";

export default function Home() {
  const [summary, setSummary] = useState(getDummySummary());
  const [history, setHistory] = useState(getDummyData);
  // 選択中の月
  const [selectMonth, setSelectMonth] = useState(getYearMonth());

  const changeDisplayMonth = (yearMonth) => {
    setSelectMonth(yearMonth);
  };

  // historyを月毎にフィルターにかける
  const filteredHistory = selectMonth
    ? history.filter((item) => item.date.startsWith(selectMonth))
    : history; // 何も選ばれてなければ今月

  // フィルタリングした内容の合計値を出す
  const filteredTotal = filteredHistory.reduce(
    (acc, cur) => acc + cur.amount,
    0,
  );

  const navigate = useNavigate();
  const onEdit = (targetId) => {
    const targetHistoryItem = history.find((item) => item.id === targetId);

    if (targetHistoryItem) {
      navigate("/input", {
        state: { item: targetHistoryItem },
      });
    }
  };

  return (
    <main>
      <h1>おおまか家計簿</h1>
      <nav>
        <NavLink to="/input">📝 入力</NavLink>
        <SelectMonth changeDisplayMonth={changeDisplayMonth}></SelectMonth>
      </nav>
      {/* 結果表示 */}
      <section>
        <Summary total={filteredTotal} />
      </section>
      <section>
        <p>フィルター後</p>
        <HistoryList history={filteredHistory} onEdit={onEdit} />
        <CategorySummary history={filteredHistory} />
      </section>
      {/* InputFormのコンテキスト */}
      <Outlet
        context={{
          onSend: (amount, categoryId, inputDate) => {
            const newHistory = [
              ...history,
              {
                id: crypto.randomUUID(),
                amount: amount,
                category: categoryId,
                date: inputDate,
              },
            ];
            setSummary(summary + amount);
            setHistory(newHistory);
          },
          onUpdate: (editItemId, amount, categoryId, inputDate) => {
            const newHistory = history.map((item) =>
              item.id === editItemId
                ? {
                    id: editItemId,
                    amount,
                    category: categoryId,
                    date: inputDate,
                  }
                : item,
            );
            setHistory(newHistory);
            const newTotal = newHistory.reduce(
              (acc, cur) => acc + cur.amount,
              0,
            );
            setSummary(newTotal);
          },
          onRemove: (editItemId) => {
            const newHistory = history.filter((item) => item.id !== editItemId);
            setHistory(newHistory);
            const deletedItem = history.find((item) => item.id === editItemId);
            if (deletedItem) {
              setSummary(summary - deletedItem.amount);
            }
          },
        }}
      />
    </main>
  );
}

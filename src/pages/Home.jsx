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
  const onEdit = (targetHistoryIndex) => {
    const targetHistoryItem = filteredHistory[targetHistoryIndex];
    navigate("/input", {
      state: { item: targetHistoryItem },
    });
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
      <Outlet
        context={{
          onSend: (amount, category, inputDate) => {
            setSummary(summary + amount);
            setHistory([
              ...history,
              {
                id: crypto.randomUUID(),
                amount: amount,
                category: category,
                date: inputDate,
              },
            ]);
          },
          onUpdate: (editItemId, amount, selectCategory, inputDate) => {
            const newHistory = [...history];
            setHistory(newHistory);
            const targetHistoryIndex = newHistory.findIndex(
              (item) => item.id === editItemId,
            );

            if (targetHistoryIndex !== -1) {
              newHistory[targetHistoryIndex] = {
                id: editItemId,
                amount,
                category: selectCategory,
                date: inputDate,
              };
            }
            setHistory(newHistory);
            const newTotal = newHistory.reduce(
              (acc, cur) => acc + cur.amount,
              0,
            );
            setSummary(newTotal);
          },
        }}
      />
    </main>
  );
}

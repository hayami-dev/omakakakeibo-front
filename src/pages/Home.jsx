import { useState } from "react";
import Summary from "../components/Summary";
import HistoryList from "../components/HistoryList";
import CategorySummary from "../components/CategorySummary";
import MonthSummary from "../components/MonthSummary";
import { NavLink, Outlet } from "react-router";
import { getYearMonth } from "../dateUtils";
import { getDummyData, getDummySummary } from "../dummyData";
import SelectMonth from "../components/SelectMonth";

export default function Home() {
  const [result, setResult] = useState(getDummySummary());
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

  const removeHistory = (targetIndex) => {
    // indexがtargetIndexじゃないものだけ残す(配列を直で消せない)
    const newHistory = history.filter((_, index) => index !== targetIndex);

    // 新しい配列をセッターをつかって上書き
    setHistory(newHistory);

    // 合計金額(result)も減らす
    const deletedItem = history[targetIndex];
    setResult(result - deletedItem.amount);
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
        <HistoryList history={filteredHistory} onRemove={removeHistory} />
        <CategorySummary history={filteredHistory} />
      </section>
      <Outlet
        context={{
          onSend: (amount, selectCat, inputDate) => {
            setResult(result + amount);
            setHistory([
              ...history,
              { amount: amount, category: selectCat, date: inputDate },
            ]);
          },
        }}
      />
    </main>
  );
}

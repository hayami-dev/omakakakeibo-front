import { useState } from "react";
import Summary from "./Summary";
import HistoryList from "./HistoryList";
import CategorySummary from "./CategorySummary";
import { NavLink, Outlet } from "react-router";

export default function Home() {
  const [result, setResult] = useState(0);
  const [history, setHistory] = useState([]);

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
      </nav>
      {/* 結果表示 */}
      <section>
        <Summary total={result} />
      </section>
      <section>
        <HistoryList history={history} onRemove={removeHistory} />
        <CategorySummary history={history} />
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

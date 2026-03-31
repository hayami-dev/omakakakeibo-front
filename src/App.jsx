import { useState } from "react";
import "./App.css";
import Summary from "./components/Summary";
import HistoryList from "./components/HistoryList";
import InputForm from "./components/InputForm";
import CategorySummary from "./components/CategorySummary";

function App() {
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
    // 必ず1つの要素でreturnしなければいけない
    <>
      <main>
        <h1>おおまか家計簿</h1>

        {/* 結果表示 */}
        <section>
          <Summary total={result} />
        </section>
        {/* 入力 */}
        <section>
          <InputForm
            onSend={(amount, selectedCat, inputDate) => {
              setResult(result + amount);
              setHistory([
                ...history,
                { amount: amount, category: selectedCat, date: inputDate },
              ]);
            }}
          />
        </section>
        <section>
          <HistoryList history={history} onRemove={removeHistory} />
          <CategorySummary history={history} />
        </section>
      </main>
    </>
  );
}

export default App;

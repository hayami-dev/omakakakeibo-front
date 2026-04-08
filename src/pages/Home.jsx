import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { getYearMonth } from "../dateUtils";
import { getDummyData } from "../dummyData";
import Summary from "../components/Summary";
import HistoryList from "../components/HistoryList";
import CategorySummary from "../components/CategorySummary";
import SelectMonth from "../components/SelectMonth";
import MonthSummary from "../components/MonthSummary";
import { createHistoryItem, saveHistory } from "../service/historyService";

export default function Home() {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("myHistory");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) return parsed;
    }
    return getDummyData;
  });

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

  // 💡 共通の更新・保存処理
  const updateAndSaveHistory = (newHistory) => {
    setHistory(newHistory);
    saveHistory(newHistory); // 確定した最新の配列をそのまま渡す
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
          // 新しく金額データを登録
          onSend: (amount, categoryId, inputDate) => {
            const newItem = createHistoryItem(amount, categoryId, inputDate);
            updateAndSaveHistory([...history, newItem]);
          },
          // 金額データの変更
          onUpdate: (editItemId, amount, categoryId, inputDate) => {
            const newHistory = history.map((item) =>
              item.id === editItemId
                ? createHistoryItem(amount, categoryId, inputDate, editItemId)
                : item,
            );
            updateAndSaveHistory(newHistory);
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

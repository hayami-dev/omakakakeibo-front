import { useState } from "react";
import { CATEGORIES } from "../categories";
import { getFormattedDate } from "../DateUtils";

export default function InputForm({ onSend }) {
  // 今日の日付を取得
  const today = getFormattedDate();

  const [inputValue, setInputValue] = useState(""); // 金額のValue
  const [inputDate, setInputDate] = useState(today); // 日付のValue
  const limitDate = getFormattedDate(0, -6, 1); // 今日から６か月間
  const [selectCategory, setSelectCategory] = useState(""); // タグ選択のValue

  const handleLocalSend = () => {
    const amount = Number(inputValue); // 数値に加工

    // 入力チェック
    if (!inputValue || isNaN(amount) || amount <= 0) {
      alert("1円以上で入力してください");
      return;
    }
    // タグ未選択の場合
    if (selectCategory == "") {
      alert("タグを選択してください");
      return;
    }

    // Javaだと total = total + Integer.parseInt(inputValue);
    onSend(amount, selectCategory, inputDate); // 入力値を結果にセット

    setInputValue(""); //入力欄を空にする
    setSelectCategory("");
    setInputDate(today);
  };

  return (
    <>
      <input
        type="number"
        value={inputValue}
        placeholder="金額を入力"
        onChange={(e) => setInputValue(e.target.value)}
        // 👆のvalueに変更された値をセットする
        onKeyDown={(e) =>
          ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
        }
        // 一部の半角文字を入力できないようにする
      />
      <input
        type="date"
        value={inputDate}
        placeholder="おかねをつかった年月日"
        min={limitDate}
        max={today}
        onChange={(e) => setInputDate(e.target.value)}
      />
      <div>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectCategory(cat)}
            style={{
              backgroundColor: selectCategory === cat ? "yellow" : "white",
            }}
          >
            {cat}
          </button>
        ))}
      </div>
      <button onClick={handleLocalSend}>送信</button>
    </>
  );
}

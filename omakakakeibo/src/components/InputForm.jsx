import { useState } from "react";
import { CATEGORIES } from "../categories";

export default function InputForm({ onSend }) {
  const [inputValue, setInputValue] = useState(""); // 入力中の文字列
  const [selectCategory, setSelectCategory] = useState("");
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
    onSend(amount, selectCategory); // 入力値を結果にセット

    setInputValue(""); //入力欄を空にする
    setSelectCategory("");
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

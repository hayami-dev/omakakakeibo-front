import { useState } from "react";
import { CATEGORIES } from "../categories";
import { getFormattedDate } from "../dateUtils";
import { useOutletContext, useNavigate, useLocation } from "react-router";

export default function InputForm() {
  // Homeからデータを受け取る
  const location = useLocation();
  const editItem = location.state?.item;

  const today = getFormattedDate(); // 今日の日付を取得

  const [inputValue, setInputValue] = useState(editItem ? editItem.amount : ""); // 金額のValue
  const [inputDate, setInputDate] = useState(editItem ? editItem.date : today); // 日付のValue
  const [selectCategory, setSelectCategory] = useState(
    editItem ? editItem.category : "",
  ); // タグ選択のValue

  const limitDate = getFormattedDate(0, -5, 1); // 今日から６か月間

  const { onSend } = useOutletContext();
  const { onUpdate } = useOutletContext();
  const { onRemove } = useOutletContext();

  const navigate = useNavigate();

  // 入力を登録
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

    if (editItem) {
      onUpdate(editItem.id, amount, selectCategory, inputDate);
    } else {
      // Javaだと total = total + Integer.parseInt(inputValue);
      onSend(amount, selectCategory, inputDate); // 入力値を結果にセット
    }

    setInputValue(""); //入力欄を空にする
    setSelectCategory("");
    setInputDate(today);
    handleClose();
  };

  const handleRemove = () => {
    if (!window.confirm("削除しますか？")) {
      return;
    }
    onRemove(editItem.id);
    navigate("/");
  };

  // ダイアログを閉じる
  const handleClose = () => {
    navigate("/");
  };

  return (
    <section>
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
      <button onClick={handleClose}>✖ とじる</button>
      <button onClick={handleRemove}> 削除</button>
    </section>
  );
}

import { useState } from "react";
import { categoriesAtom, getCategoryStyle } from "../service/categoryService";
import { getFormattedDate } from "../dateUtils";
import { useOutletContext, useNavigate, useLocation } from "react-router";
import { useAtom } from "jotai";

export default function InputForm() {
  // カテゴリ名をatomで取得
  const [categories] = useAtom(categoriesAtom);

  // Homeからデータを受け取る
  const location = useLocation();
  const editItem = location.state?.item;

  const today = getFormattedDate(); // 今日の日付を取得

  const [inputValue, setInputValue] = useState(editItem ? editItem.amount : ""); // 金額のValue
  const [inputDate, setInputDate] = useState(editItem ? editItem.date : today); // 日付のValue
  const [selectCategory, setSelectCategory] = useState(
    editItem ? editItem.category : "",
  ); // タグ選択のValue

  const displayCategories = categories.filter((cat) => {
    // 空欄を除外
    if (!cat.name || cat.name.trim() === "") return false;

    // editかつ前方一致した古いカテゴリを呼び出す
    if (editItem && cat.id.startsWith(editItem.category)) {
      return true;
    }

    // 他oldを除外
    if (cat.id.includes("_old")) return false;

    // アクティブを返す
    if (cat.isActive) return true;

    // それ以外は出さない
    return false;
  });

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
        {displayCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectCategory(cat.id)}
            style={{
              backgroundColor:
                selectCategory === cat.id
                  ? "black"
                  : getCategoryStyle(cat.colorIndex).code,
              color:
                selectCategory === cat.id
                  ? getCategoryStyle(cat.colorIndex).code
                  : "white",
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <button onClick={handleLocalSend}>送信</button>
      <button onClick={handleClose}>✖ とじる</button>
      {editItem && <button onClick={handleRemove}> 削除</button>}
    </section>
  );
}

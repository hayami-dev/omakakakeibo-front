import { useMemo, useState } from "react";
import { useAtom } from "jotai";
// import { CATEGORIES } from "../categories";
import {
  COLOR_MAP,
  activeCategoriesAtom,
  archivedCategoriesAtom,
  resolveCategoryById,
} from "../service/categoryService";
import { getFormattedDate } from "../dateUtils";
import { useOutletContext, useNavigate, useLocation } from "react-router";
import "./InputForm.css";

export default function InputForm() {
  // カテゴリを取得
  const [activeCategories] = useAtom(activeCategoriesAtom);
  const [archivedCategories] = useAtom(archivedCategoriesAtom);

  // 日付関係の取得
  const today = getFormattedDate(); // 今日の日付を取得
  const limitDate = getFormattedDate(0, -5, 1); // 今日から６か月間

  // Homeからデータを受け取る
  const location = useLocation();
  const editItem = location.state?.item;

  // 入力値の取得
  const [inputValue, setInputValue] = useState(editItem ? editItem.amount : ""); // 金額のValue
  const [inputDate, setInputDate] = useState(editItem ? editItem.date : today); // 日付のValue

  // 表示するカテゴリ一覧をidをもとに作成
  const displayCategories = useMemo(() => {
    let list = [...activeCategories];

    if (editItem?.categoryId) {
      const isActive = activeCategories.some(
        (cat) => cat.id === editItem.categoryId,
      );

      if (!isActive) {
        const archivedTarget = resolveCategoryById(
          editItem.categoryId,
          activeCategories,
          archivedCategories,
        );
        if (archivedTarget) {
          list.push(archivedTarget);
        }
      }
    }
    return list
      .filter((cat) => cat.name && cat.name.trim() !== "")
      .sort((a, b) => a.colorIndex - b.colorIndex);
  }, [activeCategories, archivedCategories, editItem]);

  // 選択中のカテゴリの初期値を取得
  const [selectCategory, setSelectCategory] = useState(() => {
    if (editItem?.categoryId) {
      return displayCategories.find((c) => c.id === editItem.categoryId) || "";
    }
  });

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
    if (!selectCategory?.id?.trim()) {
      alert("タグを選択してください");
      return;
    }

    // データ送信(カテゴリはidのみ渡す)
    if (editItem) {
      onUpdate(editItem.id, amount, selectCategory.id, inputDate);
    } else {
      // Javaだと total = total + Integer.parseInt(inputValue);
      onSend(amount, selectCategory.id, inputDate); // 入力値を結果にセット
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
    <div className="modal-dialog">
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
        {displayCategories.map((cat) => {
          return (
            <button
              key={cat.id}
              onClick={() => setSelectCategory(cat)}
              style={{
                color: selectCategory?.id === cat.id ? "white" : cat.style.code,
                backgroundColor:
                  selectCategory?.id === cat.id ? cat.style.code : "white",
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
      <button onClick={handleLocalSend}>送信</button>
      <button onClick={handleClose}>✖ とじる</button>
      {editItem && <button onClick={handleRemove}> 削除</button>}
    </div>
  );
}

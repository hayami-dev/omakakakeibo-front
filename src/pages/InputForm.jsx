import { useMemo, useState } from "react";
import { useAtom } from "jotai";
// import { CATEGORIES } from "../categories";
import {
  activeCategoriesAtom,
  categoriesMasterAtom,
  resolveCategoryById,
} from "../service/categoryService";
import { getFormattedDate } from "../dateUtils";
import { useOutletContext, useNavigate, useLocation } from "react-router";
import "./InputForm.css";
import { historyService, historiesAtom } from "../service/historyService";

export default function InputForm() {
  // TODO：リファクタリングで削除 ユーザーID
  const currentUserId = 1;

  const [histories, setHistories] = useAtom(historiesAtom);

  // カテゴリを取得
  const [activeCategories] = useAtom(activeCategoriesAtom);
  const [categoriesMaster] = useAtom(categoriesMasterAtom);

  // 日付関係の取得
  const today = getFormattedDate(); // 今日の日付を取得
  const limitDate = getFormattedDate(0, -5, 1); // 今日から６か月間

  // Homeからデータを受け取る
  const location = useLocation();
  const editItem = location.state?.item;

  // 入力値の取得
  const [inputAmount, setInputAmount] = useState(
    editItem ? editItem.amount : "",
  ); // 金額のValue
  const [inputDate, setInputDate] = useState(
    editItem ? editItem.historyDate : today,
  ); // 日付のValue

  // 表示するカテゴリ一覧をidをもとに作成
  const displayCategories = useMemo(() => {
    let list = [...activeCategories];

    // 編集時
    if (editItem?.categoryId) {
      // activeテーブルにmasterのどれが含まれているか
      const isActive = activeCategories.some(
        (cat) => cat.categoryId === editItem.categoryId,
      );

      if (!isActive) {
        const archivedTarget = resolveCategoryById(
          editItem.categoryId,
          categoriesMaster,
        );
        if (archivedTarget) {
          list.push(archivedTarget);
        }
      }
    }
    const displayList = list.map((cat) => ({
      ...cat,
      name: cat.categoryName,
      id: cat.categoryId,
    }));

    return displayList
      .filter((cat) => cat.name && cat.name.trim() !== "")
      .sort((a, b) => a.colorIndex - b.colorIndex);
  }, [activeCategories, categoriesMaster, editItem]);

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
  const handleLocalSend = async (e) => {
    e.preventDefault();

    try {
      // 入力チェック
      const amountNum = Number(inputAmount);

      // 金額が未入力の場合
      if (!inputAmount || isNaN(amountNum) || amountNum <= 0) {
        alert("1円以上で入力してください");
        return;
      }
      // 日付が未入力の場合
      if (!inputDate) {
        alert("日付を選択してください");
        return;
      }
      // タグ未選択の場合
      if (!selectCategory) {
        alert("タグを選択してください");
        return;
      }

      // 登録用オブジェクト作成
      const historyItem = {
        categoryId: selectCategory.categoryId,
        amount: amountNum,
        historyDate: inputDate,
      };

      // POST送信
      await historyService.saveHistory(currentUserId, historyItem);
      console.log("DBへの登録が成功しました！");

      // Atomを再取得
      const updatedHistories =
        await historyService.fetchHistories(currentUserId);
      setHistories(updatedHistories);

      setInputAmount(""); //入力欄を空にする
      setSelectCategory("");
      setInputDate(today);
      handleClose();
    } catch (error) {
      console.error("登録処理でエラーが発生しました:", error);
      alert("登録に失敗しました。時間をおいて再度お試しください。");
    }
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
      <form action="" method="post" onSubmit={handleLocalSend}>
        <input
          type="number"
          value={inputAmount}
          placeholder="金額を入力"
          onChange={(e) => setInputAmount(e.target.value)}
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
                type="button"
                key={cat.id}
                onClick={() => setSelectCategory(cat)}
                style={{
                  color:
                    selectCategory?.id === cat.id ? "white" : cat.style.color,
                  backgroundColor:
                    selectCategory?.id === cat.id ? cat.style.color : "white",
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
        <button type="submit">送信</button>
      </form>
      <button type="button" onClick={handleClose}>
        ✖ とじる
      </button>
      {editItem && (
        <button type="button" onClick={handleRemove}>
          削除
        </button>
      )}
    </div>
  );
}

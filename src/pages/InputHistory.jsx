/* 支出の入力をするダイアログ */

import { useRef } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import { useNavigate, useLocation } from "react-router";
/*
 * service
 */
import { historiesAtom } from "@/service/historyService";
import { userIdAtom } from "@/service/authService";
/*
 * css
 */
import "@/pages/InputHistory.css";
/*
 * components
 */
import DisplayCategories from "@/components/input/DisplayCategories";
import AmountInput from "@/components/input/AmountInput";
import DateInput from "@/components/input/DateInput";
import { deleteInputHistory, saveInputHistory } from "@/service/inputService";
import { currentMonthAtom } from "@/service/historyService";

export default function InputHistory() {
  // ユーザーIDを取得
  const USER_ID = useAtomValue(userIdAtom);

  // 支出の履歴を取得
  const setHistories = useSetAtom(historiesAtom);

  // 選択中の月
  const setCurrentMonth = useSetAtom(currentMonthAtom);

  // ページ切替のためのフック
  const navigate = useNavigate();

  // HistoryListからデータを受け取る
  const location = useLocation();
  const editItem = location.state?.item;

  // 子コンポーネントへのターゲットを定義
  const amountRef = useRef();
  const dateRef = useRef();
  const categoryRef = useRef();

  // 入力を登録
  const handleSend = async (e) => {
    e.preventDefault();

    const formData = {
      finalAmount: amountRef.current?.getValue(),
      finalDate: dateRef.current?.getValue(),
      finalCategory: categoryRef.current?.getValue(),
    };
    const refs = { amountRef, dateRef, categoryRef };

    const success = await saveInputHistory({
      formData,
      refs,
      USER_ID,
      editItem,
      setHistories,
    });

    console.log(formData);

    if (success) {
      handleClose();
      const thisMonth = formData.finalDate.substring(0, 7);
      setCurrentMonth(thisMonth);
    }
  };

  // historiesからレコードを削除
  const handleRemove = async () => {
    const success = await deleteInputHistory({
      USER_ID,
      editItem,
      setHistories,
    });

    if (success) {
      handleClose();
      const thisMonth = editItem.historyDate.substring(0, 7);
      setCurrentMonth(thisMonth);
    }
  };

  // ダイアログを閉じる
  function handleClose() {
    navigate("/");

    // スクロール位置をリセット
    window.scrollTo(0, 0);
  }

  return (
    <div className="modal-dialog">
      <form action="" onSubmit={handleSend}>
        {/* 金額の入力 */}
        <AmountInput ref={amountRef} editItem={editItem} />
        <DateInput ref={dateRef} editItem={editItem} />
        {/* カテゴリの一覧 */}
        <DisplayCategories ref={categoryRef} editItem={editItem} />
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

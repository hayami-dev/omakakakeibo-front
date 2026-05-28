/* 支出の入力をするダイアログ */

import { useRef } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import { useNavigate, useLocation } from "react-router";
/*
 * service
 */
import { historiesAtom, currentMonthAtom } from "@/service/historyService";
import { userIdAtom } from "@/service/authService";
import { deleteInputHistory, saveInputHistory } from "@/service/inputService";

/*
 * components
 */
import DisplayCategories from "@/components/input/DisplayCategories";
import AmountInput from "@/components/input/AmountInput";
import DateInput from "@/components/input/DateInput";
import Button from "@/components/ui/Button";
/*
 * assets
 */
import MoneyBag from "@/assets/icons/MoneyBag";
import Close from "@/assets/icons/close.svg";

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
    <div className="p-space-600 fixed bg-bg w-full z-99 h-full top-[5%] left-0 rounded-t-2xl shadow-[0_1px_12px]">
      <header className="relative text-center pb-space-500 border-dot-underline">
        <h1>おかねのきろく</h1>
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-[-2px] right-0"
        >
          <img src={Close} />
        </button>
      </header>
      <form
        action=""
        onSubmit={handleSend}
        className="pb-space-500 pt-space-600 flex flex-col gap-6"
      >
        <div className="flex flex-col gap-6 items-center border-dot-underline pb-space-500">
          {/* 金額の入力 */}
          <AmountInput ref={amountRef} editItem={editItem} />
          {/* 日付の入力 */}
          <DateInput ref={dateRef} editItem={editItem} />
        </div>
        {/* カテゴリの一覧 */}
        <div className="flex flex-col gap-4 pb-space-500">
          <p className="font-deco text-xl text-main-default">
            このおかねは・・・
          </p>
          <DisplayCategories ref={categoryRef} editItem={editItem} />
        </div>
        {/* TODO:バリデーションによって活性、非活性を切り替える */}
        <div className="flex flex-col pb-space-500 border-dot-underline">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={MoneyBag}
            className="w-full"
          >
            きろくする
          </Button>
        </div>
      </form>

      {editItem && (
        <button type="button" onClick={handleRemove}>
          削除
        </button>
      )}
    </div>
  );
}

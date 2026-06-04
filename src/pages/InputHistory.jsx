/* 支出の入力をするダイアログ */

import { useRef, useState } from "react";
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
import Trash from "@/assets/icons/trash.svg";
import Help from "@/assets/icons/help.svg";

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

  // 画面内に入力エラーがあるか
  const [isAmountError, setIsAmountError] = useState(false);

  // 入力を登録
  const handleSend = async (e) => {
    try {
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
    } catch (errorData) {
      // もしエラーが複数（配列）の形で届いたら、中身を取り出す
      if (Array.isArray(errorData)) {
        // 全てのエラーメッセージを改行（\n）でつなげて1つの文章にする
        const combinedMessage = errorData.map((err) => err.message).join("\n");
        alert(combinedMessage);

        // エラーが1個だったらそのまま出す
      } else if (errorData && errorData.code) {
        alert(errorData.message);

        // 他のシステムエラー
      } else {
        console.error("登録に失敗...", errorData);
        alert("予期せぬエラーが発生しました。");
      }
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
    <div className="py-space-600 fixed bg-bg w-full h-[95vh] z-99 bottom-0 left-0 rounded-t-2xl shadow-[0_1px_12px] ">
      <div className="w-full h-full overflow-auto px-space-600">
        <header className="relative text-center pb-space-500 border-dot-underline pt-space-100">
          <h1>おかねのきろく</h1>
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-0 right-0"
          >
            <img src={Close} />
          </button>
        </header>
        <form
          action=""
          onSubmit={handleSend}
          className="pb-space-600 pt-space-600 flex flex-col gap-6"
        >
          <section className="flex flex-col gap-6 items-center border-dot-underline pb-space-500">
            {/* 金額の入力 */}
            <AmountInput
              ref={amountRef}
              editItem={editItem}
              onErrorCheck={setIsAmountError}
            />
            {/* 日付の入力 */}
            <DateInput ref={dateRef} editItem={editItem} />
          </section>
          {/* カテゴリの一覧 */}
          <section className="flex flex-col gap-4">
            <p className="font-deco text-xl text-main-default">
              このおかねは・・・
            </p>
            <DisplayCategories ref={categoryRef} editItem={editItem} />
          </section>
          <section className="pb-space-400">
            <p className="text-sm">✅サブスクリプション（※未実装）</p>
          </section>
          {/* TODO:バリデーションによって活性、非活性を切り替える */}
          <section className="flex flex-col pb-space-600 gap-6 items-center border-dot-underline">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={MoneyBag}
              disabled={isAmountError}
            >
              きろくする
            </Button>
            {editItem && (
              <Button
                size="md"
                variant="delete"
                icon={Trash}
                onClick={handleRemove}
              >
                きろくを削除する
              </Button>
            )}
          </section>
        </form>
        <footer className="flex flex-col items-center">
          <p>※未実装</p>
          <Button variant="text" icon={Help}>
            カテゴリー機能の使い方
          </Button>
          <Button variant="text" icon={Help}>
            サブスクリプション機能
          </Button>
        </footer>
      </div>
    </div>
  );
}

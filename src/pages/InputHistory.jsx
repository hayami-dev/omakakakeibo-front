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
import { toastAtom } from "@/service/toastAtom";
import handleApiError from "@/handleApiError";

export default function InputHistory() {
  // ユーザーIDを取得
  const USER_ID = useAtomValue(userIdAtom);

  // 支出の履歴を取得
  const setHistories = useSetAtom(historiesAtom);

  // 選択中の月
  const setCurrentMonth = useSetAtom(currentMonthAtom);

  // 画面表示中かを管理
  const [isClosing, setIsClosing] = useState(false);

  // トースト通知書き換えるためのatom
  const setToast = useSetAtom(toastAtom);

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
  const [isAmountError, setIsAmountError] = useState(editItem ? false : true);
  const [isDateError, setIsDateError] = useState(false);
  const [isCategoryError, setIsCategoryError] = useState(
    editItem ? false : true,
  );

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
        setToast({
          show: true,
          message: "きろくしました！",
          type: "",
        });
      }
    } catch (error) {
      handleApiError(error);
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
      setToast({
        show: true,
        message: "削除しました",
        type: "error",
      });
    }
  };

  // ダイアログを閉じる
  function handleClose() {
    setIsClosing(true);

    setTimeout(() => {
      navigate("/");
      // スクロール位置をリセット
      window.scrollTo(0, 0);
    }, 400);
  }

  return (
    <>
      {/* オーバーレイ */}
      <div
        className={`fixed inset-0 z-[90] bg-black/30 transition-opacity duration-300
          ${isClosing ? "opacity-0" : "opacity-100"}`}
      >
        {/* ダイアログ部分 */}
        <div
          className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[400px] h-[95vh] z-[100] flex flex-col
          ${isClosing ? "my-slide-down" : "my-slide-up"}`}
        >
          <div className="py-8 bg-bg rounded-t-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.1)] flex-1 overflow-auto">
            {/* スクロール部分 */}
            <div className="w-full h-full overflow-auto px-8">
              <header className="relative text-center pb-6 border-dot-underline pt-1">
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
                className="pb-8 pt-8 flex flex-col gap-6"
              >
                <section className="flex flex-col gap-6 items-center border-dot-underline pb-6">
                  {/* 金額の入力 */}
                  <AmountInput
                    ref={amountRef}
                    editItem={editItem}
                    onErrorCheck={setIsAmountError}
                  />
                  {/* 日付の入力 */}
                  <DateInput
                    ref={dateRef}
                    editItem={editItem}
                    onErrorCheck={setIsDateError}
                  />
                </section>
                {/* カテゴリの一覧 */}
                <section className="flex flex-col gap-4">
                  <p className="font-deco text-xl text-main-default">
                    このおかねは・・・
                  </p>
                  <DisplayCategories
                    ref={categoryRef}
                    editItem={editItem}
                    onErrorCheck={setIsCategoryError}
                  />
                </section>
                <section className="pb-4">
                  <p className="text-sm">✅サブスクリプション（※未実装）</p>
                </section>
                <section className="flex flex-col pb-8 gap-6 items-center border-dot-underline">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    icon={MoneyBag}
                    disabled={isAmountError || isDateError || isCategoryError}
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
        </div>
      </div>
      <style>{`
       /* 現れるとき（0.2秒待ってから、0.5秒かけて上に） */
        .my-slide-up {
          animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s backwards;
        }

        /* 消えるとき（即座に、0.4秒かけて下に。消えた状態をキープする forwards） */
        .my-slide-down {
          animation: slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0s forwards;
        }

        @keyframes slide-up {
          0% { transform: translateY(100%); }
          100% { transform: translateY(0); }
        }

        @keyframes slide-down {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </>
  );
}

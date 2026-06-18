/* 簡易な通知を表示するコンポーネント */

import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { toastAtom } from "@/service/toastAtom";

export const Toast = () => {
  const [toast, setToast] = useAtom(toastAtom);
  const timeRef = useRef(null);

  useEffect(() => {
    if (toast.show) {
      // もしすでに古いタイマーが動いていたらクリアする（連打対策）
      if (timeRef.current) {
        clearTimeout(timeRef.current);
      }

      // 3秒後に自分自身を閉じる（falseにする）タイマーをセット
      timeRef.current = setTimeout(() => {
        setToast({
          show: false,
          message: "",
          type: toast.type,
        });
        timeRef.current = null;
      }, 3000);
    }

    // クリーンアップ関数（コンポーネント消滅時にタイマーを消す安全策）
    return () => {
      if (toast.show && timeRef.current) {
        clearTimeout(timeRef.current);
      }
    };
  }, [toast.show, setToast, toast.type]);

  const baseStyle =
    "fixed left-1/2 -translate-x-1/2 w-[80vw] max-w-[400px] h-fit px-6 py-3 border shadow-xl z-[999] transition-all duration-500 ease-out rounded-xl flex gap-2";

  const colorStyle = {
    success: "border-sub-soft bg-sub-bg",
    error: "border-error-soft bg-error-bg",
  };

  // アイコン（絵文字）のマッピング
  const iconStyle = {
    success: "✨",
    error: "⚠️",
  };

  const currentStyle = colorStyle[toast.type] || colorStyle.success;
  const currentIcon = iconStyle[toast.type] || iconStyle.success;

  return (
    <div
      id="text-field-wrap"
      className={`${baseStyle} ${currentStyle} ${
        toast.show
          ? "top-10 opacity-100 translate-y-0"
          : "top-0 opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <span>{currentIcon}</span>
      <p className="text-md break-all ">{toast.message}</p>
    </div>
  );
};

export default Toast;

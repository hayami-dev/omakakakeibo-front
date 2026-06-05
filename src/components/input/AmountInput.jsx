/* 支出金額の入力 */

import { forwardRef, useImperativeHandle, useState } from "react";
import TextField from "@/components/ui/TextField";
import ImageSelect from "./ImageSelect";
import { MAX_AMOUNT, MIN_AMOUNT } from "@/service/inputService";

const AmountInput = forwardRef(({ editItem, onErrorCheck }, ref) => {
  // 入力値の取得
  const [inputAmount, setInputAmount] = useState(
    editItem ? editItem.amount : "",
  ); // 金額のValue

  const [errorText, setErrorText] = useState("");

  function handleValid() {
    try {
      const num = Number(inputAmount);
      let error = "";

      if (inputAmount === "" || !inputAmount) {
        error = "金額を入力してください。";
      } else if (isNaN(num)) {
        error = "不正な値です。半角数字で入力してください。";
      } else if (num > 99999999) {
        error = "金額が大きすぎます。9,999万9,999円以内で入力してください。";
      } else if (num < 1) {
        error = "1円以上で入力してください。";
      }

      setErrorText(error);

      // 親にエラーの有無を通知（true / false）
      if (onErrorCheck) {
        onErrorCheck(!!error); // エラー文字列があれば true, 空なら false
      }

      return !error;
    } catch (e) {
      console.error(e);
      setErrorText("不正な値です。半角数字で入力してください。");
      if (onErrorCheck) onErrorCheck(true);
      return false;
    }
  }

  // 親が取得する値を定義
  useImperativeHandle(ref, () => ({
    // 引き渡し
    getValue: () => {
      const isValid = handleValid(inputAmount);
      if (!isValid) return null;

      return inputAmount;
    },
    // 削除
    clearValue: () => setInputAmount(""),
  }));

  return (
    <fieldset>
      <div className="flex items-center gap-6">
        <label htmlFor="amount" className="text-lg font-black text-nowrap">
          つかった金額
        </label>
        <div className="relative">
          <div className="absolute top-[-30px]">
            <ImageSelect />
          </div>
          <TextField
            size="lg"
            type="number"
            placeholder="100"
            id="amount"
            value={inputAmount}
            onChange={setInputAmount}
            onBlur={handleValid}
            className="w-[210px]"
            isError={errorText}
            minLength={MIN_AMOUNT}
            maxLength={MAX_AMOUNT}
          />
        </div>
        <span className="text-lg font-black">円</span>
      </div>
      {errorText && (
        <p className="text-center text-error-default pt-2">{errorText}</p>
      )}
    </fieldset>
  );
});
export default AmountInput;

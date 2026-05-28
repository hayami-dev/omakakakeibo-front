/* 支出金額の入力 */

import { forwardRef, useImperativeHandle, useState } from "react";
import TextField from "@/components/ui/TextField";
import ImageSelect from "./ImageSelect";

const AmountInput = forwardRef(({ editItem }, ref) => {
  // 入力値の取得
  const [inputAmount, setInputAmount] = useState(
    editItem ? editItem.amount : "",
  ); // 金額のValue

  // 親が取得する値を定義
  useImperativeHandle(ref, () => ({
    // 引き渡し
    getValue: () => {
      return inputAmount;
    },
    // 削除
    clearValue: () => setInputAmount(""),
  }));

  return (
    <fieldset className="flex items-center gap-6">
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
          className="w-[210px]"
        />
      </div>
      <span className="text-lg font-black">円</span>
    </fieldset>
  );
});
export default AmountInput;

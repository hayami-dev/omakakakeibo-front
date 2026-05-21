/* 支出金額の入力 */

import { forwardRef, useImperativeHandle, useState } from "react";

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
    <>
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
    </>
  );
});
export default AmountInput;

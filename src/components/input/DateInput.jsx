/* 支出のあった日を入力 */

import { forwardRef, useImperativeHandle, useState } from "react";
/*
 * utils
 */
import { getFormattedDate } from "../../dateUtils";

const DateInput = forwardRef(({ editItem }, ref) => {
  // 日付関係の取得
  const today = getFormattedDate(); // 今日の日付を取得
  const limitDate = getFormattedDate(0, -5, 1); // 今日から６か月間

  const [inputDate, setInputDate] = useState(
    editItem ? editItem.historyDate : today,
  ); // 日付のValue

  // 親が取得する値を定義
  useImperativeHandle(ref, () => ({
    // 引き渡し
    getValue: () => inputDate,
    // 削除
    clearValue: () => setInputDate(today),
  }));

  return (
    <>
      <input
        type="date"
        value={inputDate}
        placeholder="おかねをつかった年月日"
        min={limitDate}
        max={today}
        onChange={(e) => setInputDate(e.target.value)}
      />
    </>
  );
});
export default DateInput;

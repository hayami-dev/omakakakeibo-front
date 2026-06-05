/* 支出のあった日を入力 */

import { forwardRef, useImperativeHandle, useState } from "react";
/*
 * utils
 */
import { getFormattedDate } from "@/dateUtils";
import TextField from "@/components/ui/TextField";

const DateInput = forwardRef(({ editItem, onErrorCheck }, ref) => {
  // 日付関係の取得
  const today = getFormattedDate(); // 今日の日付を取得
  const limitDate = getFormattedDate(0, -5, 1); // 今日から６か月間

  const [inputDate, setInputDate] = useState(
    editItem ? editItem.historyDate : today,
  ); // 日付のValue

  const [errorText, setErrorText] = useState("");

  function handleValid(currentVal) {
    const val = currentVal !== undefined ? currentVal : inputDate;

    try {
      let error = "";

      if (!val) {
        error = "日付を選択してください。";
      } else if (val < limitDate) {
        error = "6カ月以内の日付を選択してください。";
      } else if (val > today) {
        error = "未来の日付は選択できません。";
      }

      setErrorText(error);

      if (onErrorCheck) {
        onErrorCheck(!!error);
      }
      return !error;
    } catch (e) {
      console.error(e);
      setErrorText("不正な日付です。");
      if (onErrorCheck) onErrorCheck(true);
      return false;
    }
  }

  // ピッカーが押された瞬間に反映
  const handleDateChange = (val) => {
    setInputDate(val);
    setTimeout(() => handleValid(val), 0);
  };

  // 親が取得する値を定義
  useImperativeHandle(ref, () => ({
    // 引き渡し
    getValue: () => {
      const isValid = handleValid();
      if (!isValid) return null;
      return inputDate;
    },
    // 削除
    clearValue: () => setInputDate(today),
  }));

  return (
    <fieldset className="">
      <div className="flex items-center gap-6 w-fit">
        <label className="text-nowrap">つかった日付</label>
        <TextField
          type="date"
          value={inputDate}
          minLength={limitDate}
          maxLength={today}
          onChange={handleDateChange}
          onBlur={() => handleValid}
          className="w-[180px]"
          isError={errorText}
        />
      </div>
      {errorText && (
        <p className="text-center text-error-default pt-2">{errorText}</p>
      )}
    </fieldset>
  );
});
export default DateInput;

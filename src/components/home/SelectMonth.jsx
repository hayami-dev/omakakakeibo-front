/* Homeでの月の切り替え用コンポーネント */

import { useSetAtom } from "jotai";
import { extractMonth, getRecentMonthsRange } from "@/dateUtils";
import { currentMonthAtom } from "@/service/historyService";

export default function SelectMonth() {
  // 選択中の月を取得
  const setCurrentMonth = useSetAtom(currentMonthAtom);

  // 表示中の月を切り替え
  const changeDisplayMonth = (yearMonth) => {
    setCurrentMonth(yearMonth);
  };

  // 今日から6ヶ月間を取得
  const activeMonthList = getRecentMonthsRange();

  return (
    <ul>
      {activeMonthList?.map((yearMonth) => {
        const displayMonth = extractMonth(yearMonth);
        return (
          <li key={yearMonth}>
            <button onClick={() => changeDisplayMonth(yearMonth)}>
              {displayMonth}月
            </button>
          </li>
        );
      })}
    </ul>
  );
}

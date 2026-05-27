/* Homeでの月の切り替え用コンポーネント */

import { useAtom } from "jotai";
import { extractMonth, getRecentMonthsRange } from "@/dateUtils";
import { currentMonthAtom } from "@/service/historyService";

export default function SelectMonth() {
  // 選択中の月を取得
  const [currentMonth, setCurrentMonth] = useAtom(currentMonthAtom);

  // 表示中の月を切り替え
  const changeDisplayMonth = (yearMonth) => {
    setCurrentMonth(yearMonth);
  };

  // 今日から6ヶ月間を取得
  const activeMonthList = getRecentMonthsRange();

  return (
    <ul className="grid grid-cols-12 text-center pt-space-100">
      {activeMonthList?.map((yearMonth, index) => {
        const [year, month] = yearMonth.split("-");
        const isJanOrDec = month === "12" || month === "01" || index === 0;
        const displayMonth = extractMonth(yearMonth);
        return (
          <li
            key={yearMonth}
            className={`col-span-2 ${yearMonth === currentMonth ? "opacity-100" : "opacity-50"}`}
          >
            <button
              onClick={() => changeDisplayMonth(yearMonth)}
              className="text-xl"
            >
              {displayMonth}
              <span className="text-base">月</span>
            </button>
            {isJanOrDec && <span className="block text-xs">{year}年</span>}
          </li>
        );
      })}
    </ul>
  );
}

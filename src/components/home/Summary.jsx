/* 各月毎の合計値、目標金額を表示する */

import { useAtomValue, useAtom } from "jotai";
import {
  monthlyBudgetAtom,
  getRemainingMonthlyBudget,
  formatAmountWithSign,
} from "@/service/budgetService";
import {
  historiesAtom,
  currentMonthAtom,
  calcMonthSummary,
} from "@/service/historyService";
import { extractMonth } from "@/dateUtils";
import HomeAmountDeco from "@/assets/home-amount-deco.svg";
import HomeAmountDecoNoData from "@/assets/no-data-txt.svg";
import ChevronRightIcon from "@/assets/icons/ChevronRightIcon";
import { getRecentMonthsRange } from "@/dateUtils";

export default function Summary() {
  // 支出の履歴を取得
  const histories = useAtomValue(historiesAtom);

  // 目標金額の取得
  const monthlyBudget = useAtomValue(monthlyBudgetAtom);

  // 選択中の月の取得
  const [currentMonth, setCurrentMonth] = useAtom(currentMonthAtom);

  // 変更可能な月を取得
  const monthsRange = getRecentMonthsRange();

  // 選択中の月が何番目かを探す
  const currentIndex = monthsRange.indexOf(currentMonth);

  // 制限の判定値
  const isFirstMonth = currentIndex === 0;
  const isLastMonth = currentIndex === monthsRange.length - 1;

  // 左ボタンを押したときの処理
  const handlePrevMonth = () => {
    if (!isFirstMonth) {
      setCurrentMonth(monthsRange[currentIndex - 1]);
    }
  };

  // 右ボタンを押したときの処理
  const handleNextMonth = () => {
    if (!isLastMonth) {
      setCurrentMonth(monthsRange[currentIndex + 1]);
    }
  };

  // 渡されたhistoriesからselectMonth毎の合計値を計算
  const total = calcMonthSummary(histories)[currentMonth] || 0;

  // 各月の合計値と目標金額との差額
  const remaining = getRemainingMonthlyBudget(total, monthlyBudget);

  return (
    <div className="grid grid-cols-12 items-center">
      <button
        disabled={isFirstMonth}
        onClick={handlePrevMonth}
        className="col-span-2 justify-items-center disabled:opacity-50 disabled:pointer-events-none"
      >
        <ChevronRightIcon className="w-[48px] h-auto rotate-180 text-text-cap" />
      </button>
      <div className="bg-bg-section2 justify-items-center col-span-8 px-4 py-2 rounded-3xl rounded-br-xs">
        <div className="w-[fit-content]">
          <p className="text-sm font-bold">
            <span className="text-xl pr-[0.1rem]">
              {extractMonth(currentMonth)}
            </span>
            月のきろく
          </p>
          {total ? (
            <p className="flex items-baseline font-extrabold text-xl">
              <strong className="text-3xl pr-[0.25rem]">
                {total?.toLocaleString()}
              </strong>
              <span className="pr-[0.25rem]">円</span>
              <img src={HomeAmountDeco} alt="" className="w-[40px]" />
            </p>
          ) : (
            <img src={HomeAmountDecoNoData} alt="" className="w-[160px] py-2" />
          )}
        </div>
        <p className="text-base w-[fit-content]">
          目標金額：
          <span
            style={{
              color:
                remaining >= 1
                  ? "var(--color-error-default)"
                  : "var(--color-cat-color-0)",
            }}
            className="text-xl"
          >
            {formatAmountWithSign(remaining)}
            <span className="text-base pl-[0.25rem]">円</span>
          </span>
        </p>
      </div>
      <button
        disabled={isLastMonth}
        onClick={handleNextMonth}
        className="col-span-2 justify-items-center disabled:opacity-50 disabled:pointer-events-none"
      >
        <ChevronRightIcon className="w-[48px] h-auto text-text-cap" />
      </button>
    </div>
  );
}

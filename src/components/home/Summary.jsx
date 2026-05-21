/* 各月毎の合計値、目標金額を表示する */

import { useAtomValue } from "jotai";
import {
  monthlyBudgetAtom,
  getRemainingMonthlyBudget,
  formatAmountWithSign,
} from "../../service/budgetService";
import {
  historiesAtom,
  currentMonthAtom,
  calcMonthSummary,
} from "../../service/historyService";

export default function Summary() {
  // 支出の履歴を取得
  const histories = useAtomValue(historiesAtom);

  // 目標金額の取得
  const monthlyBudget = useAtomValue(monthlyBudgetAtom);

  // 選択中の月の取得
  const currentMonth = useAtomValue(currentMonthAtom);

  // 渡されたhistoriesからselectMonth毎の合計値を計算
  const total = calcMonthSummary(histories)[currentMonth] || 0;

  // 各月の合計値と目標金額との差額
  const remaining = getRemainingMonthlyBudget(total, monthlyBudget);

  return (
    <>
      <p>
        {currentMonth}月の合計：
        <strong>{total?.toLocaleString()}円</strong>
      </p>
      <p>目標金額{monthlyBudget?.toLocaleString()}円</p>
      <p style={{ color: remaining >= 1 ? "red" : "green" }}>
        目標金額との差額{formatAmountWithSign(remaining)}円
      </p>
    </>
  );
}

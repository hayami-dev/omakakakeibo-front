/* 各月毎の合計値、目標金額を表示する */

import {
  getRemainingMonthlyBudget,
  formatAmountWithSign,
} from "../../service/budgetService";
import { calcMonthSummary } from "../../service/historyService";

export default function Summary({ histories, selectMonth, monthlyBudget }) {
  // 渡されたhistoriesからselectMonth毎の合計値を計算
  const total = calcMonthSummary(histories)[selectMonth] || 0;

  // 各月の合計値と目標金額との差額
  const remaining = getRemainingMonthlyBudget(total, monthlyBudget);

  return (
    <>
      <p>
        {selectMonth}月の合計：
        <strong>{total?.toLocaleString()}円</strong>
      </p>
      <p>目標金額{monthlyBudget?.toLocaleString()}円</p>
      <p style={{ color: remaining >= 1 ? "red" : "green" }}>
        目標金額との差額{formatAmountWithSign(remaining)}円
      </p>
    </>
  );
}

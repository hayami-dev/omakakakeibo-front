import {
  getRemainingMonthlyBudget,
  formatAmountWithSign,
} from "../service/budgetService";

/* 月毎の合計金額、縦線グラフを表示する */

export default function Summary({ total, selectMonth, monthlyBudget }) {
  const remaining = getRemainingMonthlyBudget(total, monthlyBudget);

  return (
    <>
      <p>
        {selectMonth}月の合計：
        <strong>{total.toLocaleString()}円</strong>
      </p>
      <p>目標金額{monthlyBudget.toLocaleString()}円</p>
      <p style={{ color: remaining >= 1 ? "red" : "green" }}>
        目標金額との差額{formatAmountWithSign(remaining)}円
      </p>
    </>
  );
}

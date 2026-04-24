import { useState } from "react";
import { useAtom } from "jotai";
import {
  INITIAL_MONTHLY_BUDGET,
  BUDGET_MIN_AMOUNT,
  BUDGET_MAX_AMOUNT,
  monthlyBudgetAtom,
  saveMonthlyBudget,
} from "../../service/budgetService";

export default function BudgetEdit() {
  const [monthlyBudget, setMonthlyBudget] = useAtom(monthlyBudgetAtom);
  const [inputValue, setInputValue] = useState(monthlyBudget);

  const strInitialMonthlyBudget = INITIAL_MONTHLY_BUDGET.toLocaleString();
  const strMonthlyBudgetMin = BUDGET_MIN_AMOUNT.toLocaleString();
  const strMonthlyBudgetMax = BUDGET_MAX_AMOUNT.toLocaleString();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // 空欄やマイナス値は0を入れる
  const handleBlur = () => {
    let num = Number(inputValue);

    if (isNaN(num) || num < 0) {
      num = 0;
    }

    setInputValue(String(num));
  };

  const handleSave = () => {
    const num = Number(inputValue);
    // 範囲外の入力だった場合はじく
    if (isNaN(num) || num < BUDGET_MIN_AMOUNT || num > BUDGET_MAX_AMOUNT) {
      alert(
        `${strMonthlyBudgetMin}～${strMonthlyBudgetMax}円までの金額を入力してください`,
      );
      return;
    }
    const finalValue = Number(inputValue);
    setMonthlyBudget(finalValue);
    saveMonthlyBudget(finalValue);
    alert("保存しました");
  };

  return (
    <>
      <h1>目標金額の変更</h1>
      <p>デフォルトは{strInitialMonthlyBudget}円です。</p>
      <br />
      <p>
        今の目標金額：<strong>{monthlyBudget.toLocaleString()}円</strong>
      </p>
      <br />
      <p>
        {strMonthlyBudgetMin}～{strMonthlyBudgetMax}
        円までの金額を入力してください。
      </p>
      <br />
      <form action="">
        <div>
          <label htmlFor="monthly-budget">目標金額</label>
          <input
            type="number"
            name="monthly-budget"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            id="monthly-budget"
          />
          円
        </div>
        <button type="button" onClick={handleSave}>
          変更
        </button>
      </form>
    </>
  );
}

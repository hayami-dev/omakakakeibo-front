import { useState } from "react";
import { useAtom } from "jotai";
import {
  INITIAL_MONTHLY_BUDGET,
  monthlyBudgetAtom,
  saveMonthlyBudget,
} from "../../service/budgetService";

export default function BudgetEdit() {
  const [monthlyBudget, setMonthlyBudget] = useAtom(monthlyBudgetAtom);
  const [inputValue, setInputValue] = useState(monthlyBudget);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    let num = Number(inputValue);

    if (isNaN(num) || num < 0) {
      num = 0;
    }

    setInputValue(String(num));
  };

  const handleSave = () => {
    const finalValue = Number(inputValue);
    setMonthlyBudget(finalValue);
    saveMonthlyBudget(finalValue);
    alert("保存しました");
  };

  return (
    <>
      <h1>目標金額の変更</h1>
      <p>デフォルトは{INITIAL_MONTHLY_BUDGET.toLocaleString()}円です。</p>
      <p>{monthlyBudget.toLocaleString()}円</p>
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
        <button onClick={handleSave}>変更</button>
      </form>
    </>
  );
}

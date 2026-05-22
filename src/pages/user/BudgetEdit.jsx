import { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  INITIAL_MONTHLY_BUDGET,
  BUDGET_MIN_AMOUNT,
  BUDGET_MAX_AMOUNT,
  monthlyBudgetAtom,
  budgetService,
  updateBudget,
} from "../../service/budgetService";
import { getYearMonth } from "../../dateUtils";
import { userIdAtom } from "../../authService";

export default function BudgetEdit() {
  // ユーザーIDを取得
  const USER_ID = useAtomValue(userIdAtom);

  // 今月を取得
  const currentMonth = getYearMonth();

  // DBからの目標金額
  const [monthlyBudget, setMonthlyBudget] = useAtom(monthlyBudgetAtom);

  // inputの入力値
  const [inputValue, setInputValue] = useState(monthlyBudget);

  // デフォルト値、最大値、最小値を取得
  const strInitialMonthlyBudget = INITIAL_MONTHLY_BUDGET.toLocaleString();
  const strMonthlyBudgetMin = BUDGET_MIN_AMOUNT.toLocaleString();
  const strMonthlyBudgetMax = BUDGET_MAX_AMOUNT.toLocaleString();

  // 画面更新（リロード）対策の読み込み処理
  useEffect(() => {
    const loadBudget = async () => {
      const budgetAmount = await budgetService.fetchMonthlyBudget(
        USER_ID,
        currentMonth,
      );
      setMonthlyBudget(budgetAmount);
    };
    loadBudget();
  }, [currentMonth, setMonthlyBudget]);

  // 目標金額の変更（ロード完了など）と同時にinputValueに挿入
  useEffect(() => {
    setInputValue(String(monthlyBudget));
  }, [monthlyBudget]);

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

  const handleSave = async (e) => {
    e.preventDefault();
    const success = await updateBudget({
      inputValue,
      USER_ID,
      currentMonth,
      setMonthlyBudget,
    });

    if (success) {
      alert("保存しました");
    }
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
      <form action="" onSubmit={handleSave}>
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
        <button type="submit">変更</button>
      </form>
    </>
  );
}

/* 目標金額(budget)の変更画面 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAtom, useAtomValue } from "jotai";
import {
  INITIAL_MONTHLY_BUDGET,
  BUDGET_MIN_AMOUNT,
  BUDGET_MAX_AMOUNT,
  monthlyBudgetAtom,
  budgetService,
  updateBudget,
} from "@/service/budgetService";
import { getYearMonth } from "@/dateUtils";
import { userIdAtom } from "@/service/authService";
import BasePage from "@/components/ui/BasePage";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";

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

  // 空欄やマイナス値は0を入れる
  const handleBlur = () => {
    let num = Number(inputValue);

    if (isNaN(num) || num < 0) {
      num = 0;
    }

    setInputValue(String(num));
  };

  // ページ切替のためのフック
  const navigate = useNavigate();

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
      navigate("/user");
    }
  };

  return (
    <>
      <BasePage title={"目標金額の設定"}>
        <div>
          <p>
            毎月の金額の上限を設定してください。
            つかいすぎの防止や、日々の振り返りに 使えます。
          </p>
          <p className="text-sm text-text-cap pt-4">
            デフォルトは{strInitialMonthlyBudget}円です。
            <br />
            <span>
              {strMonthlyBudgetMin}～{strMonthlyBudgetMax}
              円までの金額を入力してください。
            </span>
          </p>
        </div>
        <form action="" onSubmit={handleSave} className="flex flex-col gap-8">
          <fieldset className="flex gap-4 items-baseline text-lg font-black">
            <label htmlFor="monthly-budget" className="text-nowrap">
              目標金額
            </label>
            <TextField
              type="number"
              value={inputValue}
              onChange={setInputValue}
              onBlur={handleBlur}
              id="monthly-budget"
              className="w-full"
            />
            円
          </fieldset>
          <Button type="submit" variant="primary">
            変更
          </Button>
        </form>
      </BasePage>
    </>
  );
}

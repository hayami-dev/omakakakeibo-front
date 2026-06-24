/* 目標金額(budget)の変更画面 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
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
import AttentionText from "@/components/ui/HelpText";
import { toastAtom } from "@/service/toastAtom";
import handleApiError from "@/handleApiError";

export default function BudgetEdit({ nextStep }) {
  // ユーザーIDを取得
  const USER_ID = useAtomValue(userIdAtom);

  // 今月を取得
  const currentMonth = getYearMonth();

  // DBからの目標金額
  const [monthlyBudget, setMonthlyBudget] = useAtom(monthlyBudgetAtom);

  // inputの入力値
  const [inputValue, setInputValue] = useState(monthlyBudget);

  // エラーメッセージを管理
  const [errorText, setErrorText] = useState("");

  // トースト通知書き換えるためのatom
  const setToast = useSetAtom(toastAtom);

  // デフォルト値、最大値、最小値を取得
  const strInitialMonthlyBudget = INITIAL_MONTHLY_BUDGET.toLocaleString();
  const strMonthlyBudgetMin = BUDGET_MIN_AMOUNT.toLocaleString();
  const strMonthlyBudgetMax = BUDGET_MAX_AMOUNT.toLocaleString();

  // 画面更新（リロード）対策の読み込み処理
  useEffect(() => {
    const loadBudget = async () => {
      if (monthlyBudget !== INITIAL_MONTHLY_BUDGET && monthlyBudget !== 0) {
        return;
      }
      const amount = await budgetService.loadBudgetWithFallback(
        USER_ID,
        currentMonth,
      );
      setMonthlyBudget(amount);
    };
    loadBudget();
  }, [currentMonth]);

  // 目標金額の変更（ロード完了など）と同時にinputValueに挿入
  useEffect(() => {
    setInputValue(String(monthlyBudget));
  }, [monthlyBudget]);

  // 空欄やマイナス値は0を入れる
  const handleBlur = () => {
    let num = Number(inputValue);

    if (inputValue === "" || isNaN(num)) {
      setErrorText("金額を入力してください。");
    } else if (num < BUDGET_MIN_AMOUNT || num > BUDGET_MAX_AMOUNT) {
      setErrorText(
        `${strMonthlyBudgetMin}～${strMonthlyBudgetMax}円の間で入力してください。`,
      );
    } else {
      setErrorText("");
    }
  };

  // ページ切替のためのフック
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const success = await updateBudget({
        inputValue,
        USER_ID,
        currentMonth,
        setMonthlyBudget,
      });

      if (success) {
        navigate("/user");
        setToast({
          show: true,
          message: "保存しました！",
          type: "",
        });
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const onHandleFirstSave = () => {
    nextStep();
  };

  return (
    <>
      <BasePage title={"目標金額の設定"}>
        <div>
          <p>
            毎月の金額の上限を設定してください。
            <br />
            つかいすぎの防止や、日々の振り返りに使えます。
          </p>
          <div className="pt-4 flex flex-col gap-2 items-center">
            <AttentionText>
              デフォルトは{strInitialMonthlyBudget}円です。
            </AttentionText>
            <AttentionText>
              {strMonthlyBudgetMin}～{strMonthlyBudgetMax}
              円までの金額を
              <br />
              入力してください。
            </AttentionText>
          </div>
        </div>
        <form action="" onSubmit={handleSave} className="flex flex-col gap-8">
          <fieldset className="flex flex-col gap-2 text-center">
            <div className="flex gap-4 items-baseline text-lg font-black">
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
                isError={!!errorText}
              />
              円
            </div>
            {errorText && <p className="text-error-default">{errorText}</p>}
          </fieldset>
          {!nextStep ? (
            <Button type="submit" variant="primary" disabled={!!errorText}>
              変更
            </Button>
          ) : (
            <Button
              type="submit"
              onClick={onHandleFirstSave}
              variant="primary"
              disabled={!!errorText}
            >
              目標金額を設定する
            </Button>
          )}
        </form>
      </BasePage>
    </>
  );
}

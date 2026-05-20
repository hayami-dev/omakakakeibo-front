import { atom } from "jotai";

export const INITIAL_MONTHLY_BUDGET = 50000;
export const BUDGET_MIN_AMOUNT = 1000;
export const BUDGET_MAX_AMOUNT = 9999999;

/**
 * DBとの通信
 **/
export const budgetService = {
  // DBから目標金額を取得
  // http://localhost:8080/api/budget/1/2026-03
  async fetchMonthlyBudget(userId, targetMonth) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/budget/${userId}/${targetMonth}`,
      );
      if (!response.ok) throw new Error("ネットワークエラー");

      const data = await response.json();

      return data ? data.targetAmount : INITIAL_MONTHLY_BUDGET;
    } catch (error) {
      console.error("目標金額データ取得に失敗...", error);
      return [];
    }
  },
  // DBに目標金額を保存
  // http://localhost:8080/api/budget/add/1
  async saveMonthlyBudget(value) {
    try {
      const response = await fetch(`http://localhost:8080/api/budget/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      if (!response.ok) throw new Error("ネットワークエラー");

      const data = await response.text();
      console.log("addMonthlyBudget成功:", data);

      return data;
    } catch (error) {
      console.error("目標金額データ追加に失敗...", error);
      return null;
    }
  },
};

/**
 * Atom
 */
export const monthlyBudgetAtom = atom(INITIAL_MONTHLY_BUDGET);

/**
 * 月の合計金額と目標金額の差額を計算
 * @param {*} monthlyBudget
 * @param {*} monthlyTotal
 * @returns 差額(マイナス値を許容する)
 */
export const getRemainingMonthlyBudget = (monthlyTotal, monthlyBudget) => {
  return monthlyTotal - monthlyBudget;
};

/**
 * 与えられた金額に+、-いずれかの記号を付けて返す
 * @param {*} amount
 * @returns +-の記号を付けて返す
 */
export const formatAmountWithSign = (amount) => {
  return new Intl.NumberFormat("ja-JP", {
    signDisplay: "always",
  }).format(amount);
};

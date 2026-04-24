import { atom } from "jotai";

export const INITIAL_MONTHLY_BUDGET = 50000;
export const BUDGET_MIN_AMOUNT = 1000;
export const BUDGET_MAX_AMOUNT = 9999999;

const STORAGE_KEY_BUDGET_MONTHLY = "my_budget_monthly";

// ローカルストレージから目標金額を取得
const getMonthlyBudget = () => {
  const saved = localStorage.getItem(STORAGE_KEY_BUDGET_MONTHLY);
  return saved ? JSON.parse(saved) : INITIAL_MONTHLY_BUDGET;
};

// Atomで目標金額の状態管理
export const monthlyBudgetAtom = atom(getMonthlyBudget());

// ローカルストレージに目標金額を保存
export const saveMonthlyBudget = (value) => {
  localStorage.setItem(STORAGE_KEY_BUDGET_MONTHLY, JSON.stringify(value));
};

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

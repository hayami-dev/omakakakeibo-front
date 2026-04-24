import { atom } from "jotai";

export const INITIAL_MONTHLY_BUDGET = 50000;
export const BUDGET_MIN_AMOUNT = 1000;
export const BUDGET_MAX_AMOUNT = 9999999;

const STORAGE_KEY_BUDGET_MONTHLY = "my_budget_monthly";

const getMonthlyBudget = () => {
  const saved = localStorage.getItem(STORAGE_KEY_BUDGET_MONTHLY);
  return saved ? JSON.parse(saved) : INITIAL_MONTHLY_BUDGET;
};

export const monthlyBudgetAtom = atom(getMonthlyBudget());

export const saveMonthlyBudget = (value) => {
  localStorage.setItem(STORAGE_KEY_BUDGET_MONTHLY, JSON.stringify(value));
};

import { atom } from "jotai";

export const INITIAL_MONTHLY_BUDGET = 50000;

const STORAGE_KEY_BUDGET_MONTHLY = "my_budget_monthly";

const getMonthlyBudget = () => {
  const saved = localStorage.getItem(STORAGE_KEY_BUDGET_MONTHLY);
  return saved ? JSON.parse(saved) : INITIAL_MONTHLY_BUDGET;
};

export const monthlyBudgetAtom = atom(getMonthlyBudget());

export const saveMonthlyBudget = (value) => {
  localStorage.setItem(STORAGE_KEY_BUDGET_MONTHLY, JSON.stringify(value));
};

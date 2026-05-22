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

/**
 * ユーザーが入力した目標金額をバリデーションし、DBとAtomに保存
 * * @param {Object} params - 引数のオブジェクト
 * @param {string} params.inputValue - 入力欄から受け取った文字列の金額
 * @param {number} params.USER_ID - ログイン中のユーザーID
 * @param {string} params.currentMonth - 対象の月 (フォーマット: yyyy-MM)
 * @param {Function} params.setMonthlyBudget - JotaiのAtomを更新するためのセッター関数
 * @returns {Promise<boolean>} 保存が成功した場合は true、失敗・バリデーションNGの場合は false
 */
export const updateBudget = async ({
  inputValue,
  USER_ID,
  currentMonth,
  setMonthlyBudget,
}) => {
  const num = Number(inputValue);
  // 範囲外の入力だった場合はじく
  if (isNaN(num) || num < BUDGET_MIN_AMOUNT || num > BUDGET_MAX_AMOUNT) {
    alert(
      `${BUDGET_MIN_AMOUNT.toLocaleString()}～${BUDGET_MAX_AMOUNT.toLocaleString()}円までの金額を入力してください`,
    );
    return false;
  }

  // DBへ送るデータ
  const sendData = {
    userId: USER_ID,
    targetMonth: currentMonth,
    targetAmount: num,
  };

  // 送信
  try {
    await budgetService.saveMonthlyBudget(sendData);
    setMonthlyBudget(num);
    return true;
  } catch (error) {
    console.error("目標金額の保存に失敗しました", error);
    alert("保存に失敗しました。");
    return false;
  }
};

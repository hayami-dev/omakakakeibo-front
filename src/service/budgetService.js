/**
 * @file 目標金額（Budget）に関するデータ通信およびロジックを管理するサービス
 * @description DBとのAPI通信、差額計算、バリデーション、およびJotaiのAtom操作を一本化するメソッド群
 */

import { atom } from "jotai";
import { getPrevMonth } from "@/dateUtils";

/**
 * @type {number} 初期状態の月間目標金額（デフォルト: 50,000円）
 */
export const INITIAL_MONTHLY_BUDGET = 50000;

/**
 * @type {number} 目標金額の最小許容値（1,000円）
 */
export const BUDGET_MIN_AMOUNT = 1000;

/**
 * @type {number} 目標金額の最大許容値（9,999,999円）
 */
export const BUDGET_MAX_AMOUNT = 9999999;

/**
 * 目標金額（Budget）に関するAPI通信メソッド群
 **/
export const budgetService = {
  /**
   * DBから特定のユーザー・対象月の目標金額を取得
   * データが存在しない場合はデフォルトの初期値を返す
   * http://localhost:8080/api/budget/1/2026-03
   * @param {number} userId - ログイン中のユーザーID
   * @param {string} targetMonth - 取得対象の月 (フォーマット: yyyy-MM)
   * @returns {Promise<number>} DBから取得した目標金額、またはデフォルト値
   */
  async fetchMonthlyBudget(userId, targetMonth) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/budget/${userId}/${targetMonth}`,
      );

      // 見つからない(404)、中身が空(204)の場合
      if (response.status === 404 || response.status === 204) {
        return null;
      }

      // ネットワークのエラーが発生した場合
      if (!response.ok) throw new Error("ネットワークエラー");

      // 文字列としてデータを抜いてから中身を判定
      const text = await response.text();
      if (!text || text.trim() === "" || text === "null") {
        return null;
      }

      const data = JSON.parse(text);

      return data && data.targetAmount !== undefined ? data.targetAmount : null;
    } catch (error) {
      console.error("目標金額データ取得に失敗...", error);
      return null;
    }
  },
  /**
   * DBに新しい目標金額を保存（更新）
   * http://localhost:8080/api/budget/add/1
   * @param {Object} value - 送信する予算データ
   * @param {number} value.userId - ユーザーID
   * @param {string} value.targetMonth - 対象月 (yyyy-MM)
   * @param {number} value.targetAmount - 設定する目標金額
   * @returns {Promise<string|null>} サーバーから返却されたテキスト、または失敗時 null
   */
  async saveMonthlyBudget(value) {
    try {
      const response = await fetch(`http://localhost:8080/api/budget/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });

      if (response.ok) return;

      // Javaから返ってきたエラーJSONを解析する
      const errorData = await response.json().catch(() => null);

      if (errorData && errorData.code) {
        throw errorData;
      } else {
        throw {
          code: "ERR_UNKNOWN",
          message: "ネットワークエラーが発生しました",
        };
      }
    } catch (error) {
      console.error("目標金額データ追加に失敗...", error);
      throw error;
    }
  },
  /**
   * 対象月の目標金額を取得する（データ未登録時は過去最大6ヶ月前まで自動でさかのぼる）
   * * @description
   * 家計簿の利便性を高めるため、今月が未設定であっても、過去5ヶ月以内（計6ヶ月分）に
   * 設定された目標金額があれば、その最新の設定値を「今月の目標」として自動で引き継ぐ。
   * もし直近6ヶ月間すべて未登録だった場合は、システムのデフォルト初期値（50,000円）を返す。
   * * @param {number} USER_ID - ログイン中のユーザーID
   * @param {string} currentMonth - 基点となる対象月 (フォーマット: yyyy-MM)
   * @returns {Promise<number>} 取得できた過去の目標金額、またはデフォルト初期値
   */
  async loadBudgetWithFallback(USER_ID, currentMonth) {
    let targetMonth = currentMonth; // 最初は今月からスタート

    // 今月を含めて最大6回、過去にさかのぼるループを回す
    for (let i = 0; i < 6; i++) {
      const amount = await budgetService.fetchMonthlyBudget(
        USER_ID,
        targetMonth,
      );

      if (amount !== null) {
        // データが見つかったらそれを返す
        return amount;
      }

      // 一カ月巻き戻す
      targetMonth = getPrevMonth(targetMonth);
    }

    // 6ヶ月間すべて未登録の場合初期値を返す
    return INITIAL_MONTHLY_BUDGET;
  },
};

/**
 * @type {import('jotai').PrimitiveAtom<number>}
 * 月間目標金額を管理するJotaiのグローバルAtom状態
 */
export const monthlyBudgetAtom = atom(INITIAL_MONTHLY_BUDGET);

/**
 * 月の合計金額と目標金額の差額を計算
 * @param {number} monthlyTotal - 今月の支出合計額
 * @param {number} monthlyBudget - 今月の目標予算額
 * @returns {number} 差額（マイナス値も許容）
 */
export const getRemainingMonthlyBudget = (monthlyTotal, monthlyBudget) => {
  return monthlyTotal - monthlyBudget;
};

/**
 * 与えられた金額に+、-いずれかの記号を付けて返す
 * @param {number} amount - 符号を付与したい金額
 * @returns {string} 符号付きのカンマ区切り金額文字列
 */
export const formatAmountWithSign = (amount) => {
  return new Intl.NumberFormat("ja-JP", {
    signDisplay: "always",
  }).format(amount);
};

/**
 * ユーザーが入力した目標金額をバリデーションし、DBとAtomに保存
 * @param {Object} params - 引数のオブジェクト
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
    throw error;
  }
};

/**
 * 目標金額の変更が可能かどうかを判定
 */
export async function checkIsEditBudget(USER_ID, currentMonth) {
  const realAmount = await budgetService.fetchMonthlyBudget(
    USER_ID,
    currentMonth,
  );

  if (realAmount !== null) {
    return false;
  } else {
    return true;
  }
}

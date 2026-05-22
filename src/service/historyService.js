/**
 * @file 支出履歴（History）に関するデータ通信およびロジックを管理するサービス
 * @description 履歴のCRUD（取得・追加・編集・削除）操作、および月別・カテゴリ別の集計を行うメソッド群
 */

import { atom, getDefaultStore } from "jotai";
import { userIdAtom } from "@/service/authService";
import { resolveCategoryById } from "@/service/categoryService";
import { getYearMonth } from "@/dateUtils";

const store = getDefaultStore();
const USER_ID = store.get(userIdAtom);

/**
 * 支出履歴（History）に関するAPI通信メソッド群
 */
export const historyService = {
  /**
   * 指定されたユーザーの全支出履歴を取得
   * http://localhost:8080/api/histories/1
   * @param {number} userId - ユーザーID
   * @returns {Promise<Array<Object>>} 支出履歴オブジェクトの配列
   */
  async fetchHistories(userId) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/histories/${userId}`,
      );
      if (!response) throw new Error("ネットワークエラー：historyService");

      const data = await response.json();
      return data.map((item) => ({
        ...item,
      }));
    } catch (error) {
      console.error("ヒストリーデータ取得に失敗...", error);
      return [];
    }
  },
  /**
   * 新しい支出履歴をDBに登録
   * http://localhost:8080/api/histories/add
   * @param {Object} historyItem - 登録する履歴データ
   * @param {number|string} historyItem.categoryId - カテゴリID
   * @param {number} historyItem.amount - 金額
   * @param {string} historyItem.historyDate - 履歴の日付 (yyyy-MM-dd)
   * @returns {Promise<void>}
   */
  async saveHistory(historyItem) {
    try {
      const bodyData = {
        userId: USER_ID,
        categoryId: historyItem.categoryId,
        amount: historyItem.amount,
        historyDate: historyItem.historyDate,
      };

      await fetch(`http://localhost:8080/api/histories/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });
    } catch (error) {
      console.error("ヒストリーデータ送信に失敗...", error);
      return [];
    }
  },
  /**
   * 既存の支出履歴の内容を更新（編集）
   * http://localhost:8080/api/histories/edit/1/{historyId}
   * @param {number} userId - ユーザーID
   * @param {number} historyId - 編集対象の履歴ID
   * @param {Object} historyItem - 更新する履歴データ
   * @param {number|string} historyItem.categoryId - カテゴリID
   * @param {number} historyItem.amount - 金額
   * @param {string} historyItem.historyDate - 履歴の日付 (yyyy-MM-dd)
   * @returns {Promise<void>}
   */
  async editHistory(userId, historyId, historyItem) {
    try {
      const bodyData = {
        categoryId: historyItem.categoryId,
        amount: historyItem.amount,
        historyDate: historyItem.historyDate,
      };

      await fetch(
        `http://localhost:8080/api/histories/edit/${userId}/${historyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        },
      );
    } catch (error) {
      console.error("ヒストリーデータ変更に失敗...", error);
      return [];
    }
  },
  /**
   * 指定された支出履歴をDBから削除
   * http://localhost:8080/api/histories/delete/1/{historyId}
   * @param {number} userId - ユーザーID
   * @param {number} historyId - 削除対象の履歴ID
   * @returns {Promise<void>}
   */
  async deleteHistory(userId, historyId) {
    try {
      await fetch(
        `http://localhost:8080/api/histories/delete/${userId}/${historyId}`,
        {
          method: "DELETE",
        },
      );
    } catch (error) {
      console.error("ヒストリーデータ削除に失敗...", error);
      return [];
    }
  },
};

/* Atomの定義 */

/**
 * @type {import('jotai').PrimitiveAtom<Array<Object>>} 全支出履歴リストを管理するグローバルAtom状態
 */
export const historiesAtom = atom([]);

/**
 * @type {import('jotai').PrimitiveAtom<string>} 現在アプリで選択中の月 (フォーマット: yyyy-MM)
 */
export const currentMonthAtom = atom(getYearMonth());

/**
 * 内部用：指定されたキー（グループ化関数）ごとに支出金額の合計を算出
 * @private
 * @param {Array<Object>} history - 計算対象の支出履歴配列
 * @param {Function} keySelector - 各履歴からグループ化キーを抽出する関数
 * @returns {Object} キーごとの合計金額を保持するオブジェクト（連想配列）
 */
const calcHistoryByGroup = (history, keySelector) => {
  return history?.reduce((acc, cur) => {
    const key = keySelector(cur);
    acc[key] = (acc[key] || 0) + cur.amount;
    return acc;
  }, {});
};

/**
 * 月ごとの支出合計金額を算出
 * @param {Array<Object>} history - 計算対象の支出履歴配列
 * @returns {Object} 「yyyy-MM」をキー、合計金額を値とするオブジェクト
 */
export const calcMonthSummary = (history) => {
  return calcHistoryByGroup(history, (item) =>
    item?.historyDate?.substring(0, 7),
  );
};

/**
 * カテゴリごとの合計値を算出し、マスターリストの名称や色情報を紐付けた整形済みの配列を返す
 * @param {Array<Object>} history - 計算対象の支出履歴配列
 * @param {Array<Object>|Object} masterList - 全カテゴリのマスターリスト
 * @returns {Array<Object>} 各カテゴリの合計金額およびスタイル情報を含むオブジェクト配列
 */
export const calcCategorySummary = (history, masterList) => {
  const totals = calcHistoryByGroup(history, (item) => item.categoryId);
  return Object.entries(totals)
    .map(([id, sum]) => {
      const category = resolveCategoryById(Number(id), masterList);
      return {
        id,
        sum,
        name: category?.categoryName || "不明なカテゴリ",
        color: category?.style.color || "gray",
        colorIndex: category?.colorIndex ?? 999,
        isActive: category?.isActive ?? false,
      };
    })
    .sort((a, b) => a.colorIndex - b.colorIndex);
};

/**
 * 支出履歴の一覧から、指定された月群（targetMonths）に合致するデータのみを抽出
 * @param {Array<Object>} history - 抽出元の支出履歴配列
 * @param {string|Array<string>} targetMonths - 抽出対象の月（単一文字列または配列）
 * @returns {Array<Object>} フィルタリング後の支出履歴配列
 */
export function filterHistoryByMonths(history, targetMonths) {
  return history.filter((item) =>
    targetMonths?.includes(item?.historyDate?.substring(0, 7)),
  );
}

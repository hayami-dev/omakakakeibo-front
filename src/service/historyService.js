/* Homeに表示する各履歴(history)の共通項目 */

import { atom, getDefaultStore } from "jotai";
import { userIdAtom } from "../authService";
import { resolveCategoryById } from "./categoryService";
import { getYearMonth } from "../dateUtils";

const store = getDefaultStore();
const USER_ID = store.get(userIdAtom);

export const historyService = {
  // histories全件取得
  // http://localhost:8080/api/histories/1
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
  // 新規追加
  // http://localhost:8080/api/histories/add
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
  // 編集
  // http://localhost:8080/api/histories/edit/1/{historyId}
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
  // 削除
  // http://localhost:8080/api/histories/delete/1/{historyId}
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

// 履歴データの配列
export const historiesAtom = atom([]);

// 選択中の月をAtom管理
// 選択中の月
export const currentMonthAtom = atom(getYearMonth());

/**
 * key毎の集計を行うロジック
 * @param {*} history
 * @param {*} keySelector
 * @returns 合計値
 */
const calcHistoryByGroup = (history, keySelector) => {
  return history?.reduce((acc, cur) => {
    const key = keySelector(cur);
    acc[key] = (acc[key] || 0) + cur.amount;
    return acc;
  }, {});
};

/**
 * 渡された月の合計値を返す
 * @param {*} history
 * @returns 合計値
 */
export const calcMonthSummary = (history) => {
  return calcHistoryByGroup(history, (item) =>
    item?.historyDate?.substring(0, 7),
  );
};

/**
 * カテゴリ毎の合計値を返す
 * @param {*} history
 * @param {*} activeCategories
 * @param {*} archivedCategories
 * @returns historyに存在するカテゴリ毎の合計値
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
 * 指定された月に含まれるデータだけを抽出する
 * @param {*} history
 * @param {*} targetMonths
 * @returns 6ヶ月間のデータ
 */
export function filterHistoryByMonths(history, targetMonths) {
  return history.filter((item) =>
    targetMonths?.includes(item?.historyDate?.substring(0, 7)),
  );
}

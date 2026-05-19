/* Homeに表示する各履歴(history)の共通項目 */
import { resolveCategoryById } from "./categoryService";
import { atom } from "jotai";

export const historyService = {
  // histories全件取得
  // http://localhost:8080/histories/1
  async fetchHistories(userId) {
    try {
      const response = await fetch(`http://localhost:8080/histories/${userId}`);
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
  // http://localhost:8080/histories/add/1
  async saveHistory(userId, historyItem) {
    const bodyData = {
      categoryId: historyItem.categoryId,
      amount: historyItem.amount,
      historyDate: historyItem.historyDate,
    };

    await fetch(`http://localhost:8080/histories/add/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });
  },
  // 編集
  // http://localhost:8080/histories/edit/1/{historyId}
  async editHistory(userId, historyId, historyItem) {
    const bodyData = {
      categoryId: historyItem.categoryId,
      amount: historyItem.amount,
      historyDate: historyItem.historyDate,
    };

    await fetch(`http://localhost:8080/histories/edit/${userId}/${historyId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });
  },
  // 削除
  // http://localhost:8080/histories/delete/1/{historyId}
  async deleteHistory(userId, historyId) {
    await fetch(
      `http://localhost:8080/histories/delete/${userId}/${historyId}`,
      {
        method: "DELETE",
      },
    );
  },
};

// 履歴データの配列
export const historiesAtom = atom([]);

/**
 * InputFormから渡される履歴オブジェクト
 * @param {*} amount
 * @param {*} categoryId
 * @param {*} historyDate
 * @param {*} id
 * @returns
 */
export const createHistoryItem = (
  amount,
  categoryId,
  historyDate,
  id = null,
) => {
  return {
    id: id || crypto.randomUUID(),
    amount: Number(amount),
    categoryId: categoryId,
    historyDate: historyDate,
  };
};

/**
 * key毎の集計を行うロジック
 * @param {*} history
 * @param {*} keySelector
 * @returns 合計値
 */
const calcHistoryByGroup = (history, keySelector) => {
  return history.reduce((acc, cur) => {
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
    item.historyDate.substring(0, 7),
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
    targetMonths.includes(item.historyDate.substring(0, 7)),
  );
}

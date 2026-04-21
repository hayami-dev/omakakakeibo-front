/* Homeに表示する各履歴(history)の共通項目 */
import { resolveCategoryById } from "./categoryService";

/**
 * InputFormから渡される履歴オブジェクト
 * @param {*} amount
 * @param {*} categoryId
 * @param {*} date
 * @param {*} id
 * @returns
 */
export const createHistoryItem = (amount, categoryId, date, id = null) => {
  return {
    id: id || crypto.randomUUID(),
    amount: Number(amount),
    categoryId: categoryId,
    date: date,
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
 * 渡された月のの合計値を返す
 * @param {*} history
 * @returns 合計値
 */
export const calcMonthSummary = (history) => {
  const totals = calcHistoryByGroup(history, (item) =>
    item.date.substring(0, 7),
  );
  return Object.entries(totals)
    .map(([month, sum]) => ({ month, sum }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

/**
 * カテゴリ毎の合計値を返す
 * @param {*} history
 * @param {*} activeCategories
 * @param {*} archivedCategories
 * @returns historyに存在するカテゴリ毎の合計値
 */
export const calcCategorySummary = (
  history,
  activeCategories,
  archivedCategories,
) => {
  const totals = calcHistoryByGroup(history, (item) => item.categoryId);
  return Object.entries(totals)
    .map(([id, sum]) => {
      const category = resolveCategoryById(
        id,
        activeCategories,
        archivedCategories,
      );
      return {
        id,
        sum,
        name: category?.name || "不明なカテゴリ",
        color: category?.style.code || "gray",
        colorIndex: category?.colorIndex ?? 999,
      };
    })
    .sort((a, b) => a.colorIndex - b.colorIndex);
};

/* Homeに表示する各履歴(history)の共通項目 */

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

/**
 * 履歴オブジェクトを生成する (スキーマの一元管理)
 */
export const createHistoryItem = (amount, categoryId, date, id = null) => {
  return {
    id: id || crypto.randomUUID(), // IDがあれば再利用（更新用）、なければ新規発行
    amount: Number(amount),
    category: categoryId,
    date: date,
  };
};

const STORAGE_KEY = "myHistory";

/**
 * 履歴一覧をLocalStorageから取得する
 * @returns {Array} 履歴オブジェクトの配列
 */
export const getHistory = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

/**
 * 履歴一覧を保存する
 * @param {Array} history - 保存する履歴の全データ
 */
export const saveHistory = (history) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

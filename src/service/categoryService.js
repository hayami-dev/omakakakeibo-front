// 初期値
export const INITIAL_CATEGORIES = [
  { id: "c1", name: "必要経費", isActive: true, colorIndex: 0 },
  { id: "c2", name: "ごほうび", isActive: true, colorIndex: 1 },
  { id: "c3", name: "推し活", isActive: true, colorIndex: 2 },
  { id: "c4", name: "カフェ", isActive: true, colorIndex: 3 },
  { id: "c5", name: "わからない", isActive: true, colorIndex: 4 },
  { id: "c6", name: "ああああああああああ", isActive: true, colorIndex: 5 },
];

// LocalStorageの名前
const STORAGE_KEY = "myCategories";

/**
 * カテゴリ一覧を取得する
 * @returns {Array} カテゴリオブジェクトの配列 (LocalStorageが空なら初期値)
 */
export const getCategories = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
};

/**
 * カテゴリ一覧をLocalStorageに保存する
 * @param {Array} categories - 保存したいカテゴリの配列
 */
export const saveCategories = (categories) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
};

/**
 * カテゴリIDからカテゴリ名を取得する共通関数
 * @param {string} id - カテゴリID ("c1" など)
 * @returns {string} - カテゴリ名 ("必要経費" など)
 */

export const getCategoryNameById = (id) => {
  const categories = getCategories();
  // LocalStrageから持って来たidと、引数で一致するものを探す
  const category = categories.find((c) => c.id === id);
  // あれば.nameを返す
  return category ? category.name : `不明なID(${id})`;
};

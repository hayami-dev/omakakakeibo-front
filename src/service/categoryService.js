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

// 色のマスター定義
const COLOR_MAP = [
  { label: "グリーン", code: "#2ecc71" },
  { label: "ピンク", code: "#e91e63" },
  { label: "ブルー", code: "#3498db" },
  { label: "イエロー", code: "#f1c40f" },
  { label: "パープル", code: "#9b59b6" },
  { label: "オレンジ", code: "#e67e22" },
];

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
  let category = categories.find((c) => c.id === id);

  // 無かったら前方一致を探す
  if (!category) {
    category = categories.find((c) => c.id.startsWith(`${id}_old`));
  }

  // nameを返す
  return category ? category.name : `不明なID(${id})`;
};

/**
 * colorIndexに対応する色設定（ラベルとコード）を返す
 */
export const getCategoryStyle = (colorIndex) => {
  // 範囲外アクセス対策でデフォルトを返す
  return COLOR_MAP[colorIndex] || { label: "未設定", code: "#95a5a6" };
};

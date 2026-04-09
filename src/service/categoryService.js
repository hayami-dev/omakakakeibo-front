import { atom } from "jotai";

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
 * colorIndex順に並び替え
 **/
const sortCategories = (list) => {
  return [...list].sort((a, b) => a.colorIndex - b.colorIndex);
};

/**
 * カテゴリ一覧を取得する
 * @returns {Array} カテゴリオブジェクトの配列 (LocalStorageが空なら初期値)
 */
export const getCategories = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
};

// Atomの定義
export const categoriesAtom = atom(sortCategories(getCategories()));

/**
 * カテゴリ一覧をLocalStorageに保存する
 * @param {Array} categories - 保存したいカテゴリの配列
 */
export const saveCategories = (categories) => {
  const sorted = sortCategories(categories);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
  return sorted;
};

/**
 * colorIndexに対応する色設定（ラベルとコード）を返す
 */
export const getCategoryStyle = (colorIndex) => {
  // 範囲外アクセス対策でデフォルトを返す
  return COLOR_MAP[colorIndex] || { label: "未設定", code: "#95a5a6" };
};

/**
 * カテゴリIDからカテゴリ名を取得する共通関数
 * @param {Array} categories - Jotaiから取得した最新名簿
 * @param {string} id - カテゴリID
 * @returns {Object} - { name: "名前", color: "#色" }
 */
export const getCategoryDisplayInfo = (categories, id) => {
  // LocalStrageから持って来たidと、引数で一致するものを探す
  let cat = categories.find((c) => c.id === id);

  // 無かったら前方一致を探す
  if (!cat) {
    cat = categories.find((c) => c.id.startsWith(`${id}_old`));
  }

  if (cat) {
    return {
      name: cat.name,
      color: getCategoryStyle(cat.colorIndex).code,
    };
  }

  // nameを返す
  return { name: `不明なID(${id})`, color: "#ccc" };
};

import { atom } from "jotai";
import { getCategoryColorSet } from "../categoryColor.js";

/**
 * userIdをもとにDBからactive_categoriesテーブルを取得する
 */
export const categoryService = {
  // http://localhost:8080/api/categories/active/1
  async fetchActiveCategories(userId) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/categories/active/${userId}`,
      );
      if (!response.ok)
        throw new Error("ネットワークエラー：fetchActiveCategories");

      const data = await response.json();

      return data
        .map((cat) => ({
          ...cat,
          style: getCategoryColorSet(cat.colorIndex),
        }))
        .sort((a, b) => a.activeCatId - b.activeCatId); // ID順に並べる
    } catch (error) {
      console.error("アクティブデータ取得に失敗...", error);
      return [];
    }
  },
  // http://localhost:8080/api/categories/master/1
  async fetchCategoriesMaster(userId) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/categories/master/${userId}`,
      );
      if (!response.ok)
        throw new Error("ネットワークエラー：fetchCategoriesMaster");

      const data = await response.json();

      return data
        .map((cat) => ({
          ...cat,
          style: getCategoryColorSet(cat.colorIndex),
        }))
        .sort((a, b) => a.activeCatId - b.activeCatId); // ID順に並べる
    } catch (error) {
      console.error("マスターデータ取得に失敗...", error);
      return [];
    }
  },
  async saveCategories(newCategories) {
    try {
      const response = await fetch(
        "http://localhost:8080/api/categories/update",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCategories),
        },
      );
      if (!response.ok) throw new Error("ネットワークエラー：onSend");

      alert("保存しました！");
    } catch (error) {
      console.error("カテゴリの登録に失敗...", error);
    }
  },
};

/* Atomの定義 */
// 大元のAtom id,name,colorIndexのみ
const activeBaseAtom = atom([]);

// baseDataをもとに整形
export const activeCategoriesAtom = atom(
  // 読み取り用
  (get) => {
    const baseDate = get(activeBaseAtom);
    // baseDataがMapならObject.valuesで配列化、配列ならそのまま
    const categoriesArray = Array.isArray(baseDate)
      ? baseDate
      : Object.values(baseDate);

    // colorIndexを元にstyleプロパティを含めて返す
    return categoriesArray
      .map((cat) => ({
        ...cat,
        // 色の情報を入れる
        style: getCategoryColorSet(cat.colorIndex),
      }))
      .sort((a, b) => a.colorIndex - b.colorIndex);
  },
  // 変更用 生データのatomを更新できるようにする
  (get, set, newValue) => {
    const nextValue =
      typeof newValue === "function"
        ? newValue(get(activeCategoriesAtom))
        : newValue;

    // DBデータ(activeCatId)かLocalデータ(id)かを判定してMapを作る
    const nextMap = nextValue.reduce((acc, cat) => {
      const { style: _style, ...pureCat } = cat;
      const key = cat.activeCatId || cat.id; // 両方に対応！
      acc[key] = pureCat;
      return acc;
    }, {});

    set(activeBaseAtom, nextMap);
  },
);

/**
 * masterAtom定義
 */
export const categoriesMasterAtom = atom([]);

/**
 * 渡されたidをもとにカテゴリリストから実体を取り出す
 * @param {number|string} id 探したいID
 * @param {Array} activeList 現在使用中のリスト
 * @param {Array} masterList 全カテゴリのリスト（アーカイブ検索用）
 */
export const resolveCategoryById = (id, masterList) => {
  if (!masterList) null;

  // masterList が配列なら .find()、オブジェクトなら values を配列にしてから探す
  const masterArray = Array.isArray(masterList)
    ? masterList
    : Object.values(masterList);

  const target = masterArray.find((c) => c.categoryId === id);

  if (target) {
    // 見つかった target の中にある isActive を参照する
    const isActive = target.isActive;

    // 共通の getCategoryColorSet を使って基本スタイルを取得
    const baseStyle = getCategoryColorSet(target.colorIndex);
    return {
      ...target,
      isActive: isActive,

      // styleオブジェクトを構成
      style: {
        ...baseStyle,
        // アーカイブなら disabledColor、そうでなければ color を使う
        color: isActive ? baseStyle.color : baseStyle.disabledColor,
      },
    };
  }

  return null;
};

/**
 * カテゴリの変更が可能かどうかを判定(月1回)
 * activeCategoriesからupdateAtをうけとって変更月を判定する
 * @param {*} today
 * @param {*} activeCategories
 * @returns boolean
 */
export const checkAlreadyEditCategory = (todayObj, activeCategories) => {
  if (!activeCategories || activeCategories.length === 0) return true;

  const latestDateStr = activeCategories.reduce((prev, current) => {
    return prev.updatedAt > current.updatedAt ? prev : current;
  }).updatedAt;

  // 最後に変更のあった日を取得
  const latestDateObj = latestDateStr ? new Date(latestDateStr) : null;

  if (!latestDateObj) return true;

  // 月に変換
  const todayMonth = `${todayObj.getFullYear()}-${todayObj.getMonth()}`;
  const latestMonth = `${latestDateObj.getFullYear()}-${latestDateObj.getMonth()}`;

  // 日付が一致しなかったらtrue(編集可)を返す
  return todayMonth !== latestMonth;
};

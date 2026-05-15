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
      if (!response.ok) throw new Error("ネットワークエラー");

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
};

// 過去のカテゴリー
const STORAGE_KEY_ARCHIVED = "my_categories_archived";

// 変更を加えた日時を保存するキー
const STORAGE_KEY_LAST_EDIT = "category_last_edit_time";

/**
 * 過去ログを取得
 * @returns {Array} カテゴリオブジェクトの配列
 */
export const getArchivedCategories = () => {
  const saved = localStorage.getItem(STORAGE_KEY_ARCHIVED);
  return saved ? JSON.parse(saved) : {};
};

/**
 * LocalStorageに保存時、styleを外す
 * @param {*} list
 * @returns styleを外した後のカテゴリ情報
 */
// const toPureMap = (list) => {
//   return list.reduce((acc, cat) => {
//     const { style: _style, ...pureCat } = cat;
//     acc[cat.id] = pureCat;
//     return acc;
//   }, {});
// };

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

    // DBデータ(activeCatId)かLocalStorageデータ(id)かを判定してMapを作る
    const nextMap = nextValue.reduce((acc, cat) => {
      const { style: _style, ...pureCat } = cat;
      const key = cat.activeCatId || cat.id; // 両方に対応！
      acc[key] = pureCat;
      return acc;
    }, {});

    set(activeBaseAtom, nextMap);
  },
);
export const archivedCategoriesAtom = atom(getArchivedCategories());

/**
 * カテゴリ一覧をLocalStorageに保存する
 * @param {Array} activeCat - 画面用のActive配列
 * @param {Object} archivedCat - ArchivedのMap
 */
// export const saveAllCategories = (activeCat, archivedCat, editDate) => {
//   const activeMap = toPureMap(activeCat);

//   // archiveするものは空欄を除去
//   const archiveArray = Object.values(archivedCat).filter((cat) => {
//     const isNotBlank = !cat.id.includes("_blank");
//     const isNotEmptyName = cat.name.trim() !== "";
//     return isNotBlank && isNotEmptyName;
//   });
//   const archivedMap = toPureMap(archiveArray);

//   localStorage.setItem(STORAGE_KEY_ARCHIVED, JSON.stringify(archivedMap));

//   // 変更を加えた日付を保存
//   localStorage.setItem(STORAGE_KEY_LAST_EDIT, JSON.stringify(editDate));

//   console.log("archivedMap:");
//   console.table(archivedMap);
//   // 日時の確認用
//   console.log(editDate.toLocaleString());
// };

/**
 * 渡されたidをもとにカテゴリリストから実体を取り出す
 * @param {string} id
 * @param {Array} activeList
 * @param {Object} archiveList
 * @returns
 */
export const resolveCategoryById = (id, activeList, archiveList) => {
  // activeから探す
  let target = activeList.find((c) => c.id === id);
  let isArchived = false;

  //無ければarchiveから探す
  if (!target) {
    const archiveArray = Object.values(archiveList);
    target = archiveArray.find((c) => {
      return c.id && c.id.startsWith(id);
    });
    if (target) isArchived = true;
  }
  if (target) {
    // colorIndexを使ってベースのスタイルを付ける
    const baseStyle = getCategoryColorSet[target.colorIndex] || {
      label: "不明",
      code: "gray",
      disabledCode: "gray",
    };
    return {
      ...target,
      // アーカイブなら末尾に飛ばす (+10)
      colorIndex: isArchived ? target.colorIndex + 10 : target.colorIndex,
      // styleオブジェクトを構成
      style: {
        ...baseStyle,
        // アーカイブなら code を disabledCode で上書き、そうでなければ元の code
        code: isArchived ? baseStyle.disabledCode || "gray" : baseStyle.code,
      },
    };
  }
  return null;
};

/**
 * カテゴリの変更が可能かどうかを判定
 * @param {*} today
 * @returns boolean
 */
export const checkAlreadyEditCategory = (today) => {
  const lastEditDateRaw = localStorage.getItem(STORAGE_KEY_LAST_EDIT);
  // ローカルストレージにデータがなければ変更されたことがないため変更可
  if (!lastEditDateRaw) return true;

  const lastEditDate = new Date(JSON.parse(lastEditDateRaw));

  // 日付が一致しなかったらtrueを返す
  return today.toDateString() !== lastEditDate.toDateString();
};

/**
 * TODO:開発用リセットボタンなので不要になったら消すこと
 */
export function resetLastEditDate() {
  localStorage.removeItem(STORAGE_KEY_LAST_EDIT);
  console.log("🛠️ カテゴリ変更制限をリセットしました");
}

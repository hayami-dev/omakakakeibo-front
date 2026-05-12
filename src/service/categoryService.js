import { atom } from "jotai";

// 初期値
export const INITIAL_CATEGORIES = [
  { id: "initial_c1", name: "必要経費", colorIndex: 0 },
  { id: "initial_c2", name: "ごほうび", colorIndex: 1 },
  { id: "initial_c3", name: "推し活", colorIndex: 2 },
  { id: "initial_c4", name: "カフェ", colorIndex: 3 },
  { id: "initial_c5", name: "わからない", colorIndex: 4 },
  { id: "initial_c6", name: "ああああああああああ", colorIndex: 5 },
];

// 色のマスター定義
export const COLOR_MAP = [
  {
    label: "グリーン",
    code: "#44AF69",
    bgCode: "#EFF8F2",
    disabledCode: "#476A54",
  },
  {
    label: "イエロー",
    code: "#F8BE10",
    bgCode: "#FEF9EA",
    disabledCode: "#867035",
  },
  {
    label: "レッド",
    code: "#F22C22",
    bgCode: "#FEECEB",
    disabledCode: "#833C38",
  },
  {
    label: "ピンク",
    code: "#E66BC7",
    bgCode: "#FDF1FA",
    disabledCode: "#8E4B7D",
  },
  {
    label: "パープル",
    code: "#9747FF",
    bgCode: "#F6EEFF",
    disabledCode: "#633A99",
  },
  {
    label: "ブルー",
    code: "#0D99FF",
    bgCode: "#E9F6FF",
    disabledCode: "#316285",
  },
];

// 現役のカテゴリー
const STORAGE_KEY_ACTIVE = "my_categories_active";

// 過去のカテゴリー
const STORAGE_KEY_ARCHIVED = "my_categories_archived";

// 変更を加えた日時を保存するキー
const STORAGE_KEY_LAST_EDIT = "category_last_edit_time";

/**
 * カテゴリ一覧を取得する
 * @returns {Array} カテゴリオブジェクトの配列 (LocalStorageが空なら初期値)
 */
export const getActiveCategories = () => {
  const saved = localStorage.getItem(STORAGE_KEY_ACTIVE);
  if (!saved) {
    // 初回は初期配列をMapに変換して返す
    return INITIAL_CATEGORIES.reduce(
      (acc, cur) => ({ ...acc, [cur.id]: cur }),
      {},
    );
  }
  return JSON.parse(saved);
};

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
const toPureMap = (list) => {
  return list.reduce((acc, cat) => {
    const { style: _style, ...pureCat } = cat;
    acc[cat.id] = pureCat;
    return acc;
  }, {});
};

/* Atomの定義 */
// 大元のAtom id,name,colorIndexのみ
const activeBaseAtom = atom(getActiveCategories());

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
        // マスタ情報をJoin
        style: COLOR_MAP[cat.colorIndex] || { label: "未設定", code: "gray" },
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
export const saveAllCategories = (activeCat, archivedCat, editDate) => {
  const activeMap = toPureMap(activeCat);

  // archiveするものは空欄を除去
  const archiveArray = Object.values(archivedCat).filter((cat) => {
    const isNotBlank = !cat.id.includes("_blank");
    const isNotEmptyName = cat.name.trim() !== "";
    return isNotBlank && isNotEmptyName;
  });
  const archivedMap = toPureMap(archiveArray);

  localStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(activeMap));
  localStorage.setItem(STORAGE_KEY_ARCHIVED, JSON.stringify(archivedMap));

  // 変更を加えた日付を保存
  localStorage.setItem(STORAGE_KEY_LAST_EDIT, JSON.stringify(editDate));

  // 保存されたカテゴリをコンソール表示
  console.log("activeMap:");
  console.table(activeMap);
  console.log("archivedMap:");
  console.table(archivedMap);
  // 日時の確認用
  console.log(editDate.toLocaleString());
};

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
    const baseStyle = COLOR_MAP[target.colorIndex] || {
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

/* TODO：DBとのつなぎこみ */
const getStyleByRemoteIndex = (index) => {
  return {
    main: `var(--cat-color-${index})`,
    bg: `var(--cat-bg-${index})`,
    disabled: `var(--cat-disabled-${index})`,
  };
};

export const categoryService = {
  // ユーザーIDを渡してカテゴリ6つを取得する
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
          style: getStyleByRemoteIndex(cat.colorIndex),
        }))
        .sort((a, b) => a.activeCatId - b.activeCatId); // ID順に並べる
    } catch (error) {
      console.error("データ取得に失敗...", error);
      return [];
    }
  },
};

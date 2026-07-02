/**
 * @file カテゴリ（Category）に関するデータ通信およびロジックを管理するサービス
 * @description カテゴリ一覧の取得・一括保存、スタイル（色）の自動付与、編集ロック判定を行うメソッド群
 */

import { atom } from "jotai";
import { getCategoryColorSet } from "@/categoryColor.js";
import apiClient from "@/apiClient";
import handleApiError from "@/handleApiError";

/**
 * カテゴリに関するAPI通信メソッド群
 */
export const categoryService = {
  /**
   * DBから特定のユーザーが現在使用中のアクティブカテゴリ一覧を取得
   * http://localhost:8080/api/categories/active
   * @returns {Promise<Array<Object>>} スタイル情報が付与され、activeCatId 順にソートされたカテゴリ配列
   */
  async fetchActiveCategories() {
    try {
      const response = await apiClient.get(`/api/categories/active`);

      return response.data
        .map((cat) => ({
          ...cat,
          style: getCategoryColorSet(cat.colorIndex),
        }))
        .sort((a, b) => a.activeCatId - b.activeCatId); // ID順に並べる
    } catch (error) {
      console.error("アクティブデータ取得に失敗...", error);
      handleApiError(error);
    }
  },
  /**
   * DBから特定のユーザーのすべてのカテゴリ（アーカイブ済含む）を取得
   * http://localhost:8080/api/categories/master
   * @returns {Promise<Array<Object>>} スタイル情報が付与され、activeCatId 順にソートされた全カテゴリ配列
   */
  async fetchCategoriesMaster() {
    try {
      const response = await apiClient.get(`/api/categories/master`);

      return response.data
        .map((cat) => ({
          ...cat,
          style: getCategoryColorSet(cat.colorIndex),
        }))
        .sort((a, b) => a.activeCatId - b.activeCatId); // ID順に並べる
    } catch (error) {
      console.error("マスターデータ取得に失敗...", error);
      handleApiError(error);
    }
  },
  /**
   * 編集・並び替えされた新しいカテゴリリストをDBに送信して一括保存
   * @param {Array<Object>} newCategories - 保存する新しいカテゴリデータの配列
   * @returns {Promise<void>}
   */
  async saveCategories(newCategories) {
    try {
      await apiClient.put("/api/categories/update", newCategories);
    } catch (error) {
      console.error("カテゴリの登録に失敗...", error);
      handleApiError(error);
    }
  },
};

/* Atomの定義 */
/**
 * @private
 * @type {import('jotai').PrimitiveAtom<Array|Object>} 生のカテゴリデータを一時保持する内部用ベースAtom
 */
const activeBaseAtom = atom([]);

/**
 * Atom読み取り時にカラースタイルを自動付与し、書き込み時にオブジェクトを自動でMap（連想配列）化する
 * 読み書き兼用の整形済みアクティブカテゴリAtom状態
 * * @type {import('jotai').WritableAtom<Array<Object>, [newValue: Array<Object>|Function], void>}
 */
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
 * @type {import('jotai').PrimitiveAtom<Array<Object>>} 全カテゴリのマスターリストを管理するJotaiのグローバルAtom状態
 */
export const categoriesMasterAtom = atom([]);

/**
 * 渡されたカテゴリIDをもとに、マスターリストから該当するカテゴリの実体を取得
 * 対象カテゴリがアーカイブ済の場合は自動的に文字色をdisabledColorに調整
 * @param {number|string} id - 検索したいカテゴリID
 * @param {Array<Object>|Object} masterList - 全カテゴリのマスターリスト（配列、またはオブジェクト形式）
 * @returns {Object|null} スタイル調整済みのカテゴリ情報オブジェクト。見つからない場合は null
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
 * カテゴリの設定変更が今月すでに実行済みかどうか（月1回制限）を判定
 * @param {Date} todayObj - 本日の日付オブジェクト（主に new Date()）
 * @param {Array<Object>} activeCategories - 現在のアクティブカテゴリリスト
 * @returns {boolean} 今月編集可能ならtrue、すでに今月は不可ならfalse
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
  const todayMonth = `${todayObj.getFullYear()}-${todayObj.getMonth() + 1} `;
  const latestMonth = `${latestDateObj.getFullYear()}-${latestDateObj.getMonth() + 1} `;

  // 日付が一致しなかったらtrue(編集可)を返す
  return todayMonth !== latestMonth;
};

/**
 * ユーザーが編集したカテゴリリストをDBに保存し、JotaiのAtomも一括で最新にする
 * @param {Object} params
 * @param {Array<Object>} params.localCategories - 画面で編集された一時的なカテゴリ配列
 * @param {Function} params.setActiveCategories - JotaiのAtomを更新するためのセッター関数
 * @returns {Promise<boolean>} 成功したら true
 */
export const updateCategories = async ({
  localCategories,
  setActiveCategories,
  setCategoriesMaster,
}) => {
  const hasOverLength = localCategories.some(
    (cat) => cat.categoryName && cat.categoryName.length > 10,
  );

  if (hasOverLength) {
    alert("⚠️ カテゴリー名は10文字以内で入力してください。");
    return false;
  }

  await categoryService.saveCategories(localCategories);

  const userId = localCategories[0]?.userId;

  if (userId) {
    // App.jsx と同じように、最新の正しいデータをJavaから取り直す
    const [freshActive, freshMaster] = await Promise.all([
      categoryService.fetchActiveCategories(userId),
      categoryService.fetchCategoriesMaster(userId),
    ]);

    // 🌟 3. APIから返ってきた「完璧なデータ」をそれぞれのアトムに安全にセットする
    setActiveCategories(freshActive);
    setCategoriesMaster(freshMaster);
  } else {
    // 万が一userIdが取れなかった場合の安全弁（文字だけ一応反映）
    setActiveCategories(localCategories);
  }

  return true;
};

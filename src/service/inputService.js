/**
 * @file 支出入力（Input）のユースケースを管理するサービス
 * @description 入力フォームからのデータ回収、バリデーション、保存、および子コンポーネントのリセットを制御するメソッド群
 */

import { historyService } from "./historyService";

/**
 * 内部用：入力値の保存前バリデーション
 * @private
 * @param {string|number} inputAmount - 入力された金額
 * @param {string} inputDate - 選択された日付 (yyyy-MM-dd)
 * @param {Object|null} selectCategory - 選択されたカテゴリ情報オブジェクト
 * @returns {Promise<boolean>} バリデーションを通過した場合は true、不備がある場合は false
 */
const inputHistoryValid = async (inputAmount, inputDate, selectCategory) => {
  // 入力チェック
  const amountNum = Number(inputAmount);

  // 金額が未入力の場合
  if (!inputAmount || isNaN(amountNum) || amountNum <= 0) {
    alert("1円以上で入力してください");
    return false;
  }
  // 日付が未入力の場合
  if (!inputDate) {
    alert("日付を選択してください");
    return false;
  }
  // タグ未選択の場合
  if (!selectCategory) {
    alert("タグを選択してください");
    return false;
  }
  return true;
};

/**
 * 内部用：各入力コンポーネントの参照（Ref）を介して、フォームの入力値を一括リセットする
 * @private
 * @param {Object} refs - 各コンポーネントのRefオブジェクトをまとめた連想配列
 * @param {Object} refs.amountRef - 金額入力用のRef
 * @param {Object} refs.categoryRef - カテゴリ選択用のRef
 * @param {Object} refs.dateRef - 日付入力用のRef
 * @returns {void}
 */
const allResetInputHistory = (refs) => {
  refs.amountRef.current?.clearValue();
  refs.categoryRef.current?.clearValue();
  refs.dateRef.current?.clearValue();
};

/**
 * 支出履歴の保存（新規登録または編集更新）を実行
 * @param {Object} params - 引数をまとめたオブジェクト
 * @param {Object} params.formData - フォームの確定データ
 * @param {string|number} params.formData.finalAmount - 最終入力された金額
 * @param {string} params.formData.finalDate - 最終選択された日付
 * @param {Object} params.formData.finalCategory - 最終選択されたカテゴリ情報
 * @param {number|string} params.formData.finalCategory.id - カテゴリID
 * @param {Object} params.refs - フォームクリアに使用するRefオブジェクト群
 * @param {number} params.USER_ID - ログイン中のユーザーID
 * @param {Object|null} params.editItem - 編集対象の履歴データ。新規登録時は null または undefined
 * @param {number} params.editItem.historyId - 編集対象の履歴ID
 * @param {Function} params.setHistories - Jotaiの全支出履歴Atomを更新するためのセッター関数
 * @returns {Promise<boolean>} 保存と状態更新、フォームクリアがすべて成功した場合は true、失敗・バリデーションNG時は false
 */
export const saveInputHistory = async ({
  formData,
  refs,
  USER_ID,
  editItem,
  setHistories,
}) => {
  const { finalAmount, finalDate, finalCategory } = formData;

  const isValid = inputHistoryValid(finalAmount, finalDate, finalCategory);
  if (!isValid) return false;

  // 登録用オブジェクト作成
  const historyItem = {
    categoryId: finalCategory.id,
    amount: Number(finalAmount),
    historyDate: finalDate,
  };

  console.log(historyItem);

  try {
    if (editItem?.historyId) {
      // PUT送信
      await historyService.editHistory(
        USER_ID,
        editItem.historyId,
        historyItem,
      );
      console.log("DBの変更が成功しました！");
    } else {
      // POST送信
      await historyService.saveHistory(historyItem);
      console.log("DBへの登録が成功しました！");
    }

    // Atomを再取得
    const updatedHistories = await historyService.fetchHistories(USER_ID);
    setHistories(updatedHistories);

    // 全フォームリセット
    allResetInputHistory(refs);
    return true;
  } catch (error) {
    console.error("保存中にエラーが発生しました", error);
    alert("保存に失敗しました。");
    return false;
  }
};

/**
 * 対象の支出履歴レコードをDBから削除し、グローバル状態を同期
 * @param {Object} params - 引数をまとめたオブジェクト
 * @param {number} params.USER_ID - ログイン中のユーザーID
 * @param {Object} params.editItem - 削除対象の履歴データ
 * @param {number} params.editItem.historyId - 削除対象の履歴ID
 * @param {Function} params.setHistories - Jotaiの全支出履歴Atomを更新するためのセッター関数
 * @returns {Promise<boolean>} ユーザーが削除を承認し、正常に削除が完了した場合は true、キャンセルまたは失敗時は false
 */
export const deleteInputHistory = async ({
  USER_ID,
  editItem,
  setHistories,
}) => {
  if (!window.confirm("削除しますか？")) {
    return false;
  }

  try {
    await historyService.deleteHistory(USER_ID, editItem.historyId);
    console.log("DBからの削除が成功しました！");

    // Atomを再取得
    const updatedHistories = await historyService.fetchHistories(USER_ID);
    setHistories(updatedHistories);

    // 成功でtrueを返す
    return true;
  } catch (error) {
    console.error("削除中にエラーが発生しました", error);
    alert("削除に失敗しました。");
    return false;
  }
};

/* 支出の入力に関するメソッド */
import { historyService } from "./historyService";

/**
 * 入力値の保存前バリデーション
 * @param {*} inputAmount
 * @param {*} inputDate
 * @param {*} selectCategory
 * @returns
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
 * 入力値の全リセット
 */
const allResetInputHistory = (refs) => {
  refs.amountRef.current?.clearValue();
  refs.categoryRef.current?.clearValue();
  refs.dateRef.current?.clearValue();
};

/**
 * historiesへの保存アクション
 * @param {*}
 * @returns boolean
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
 * historiesのレコードを削除
 * @param {*}
 * @returns boolean
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

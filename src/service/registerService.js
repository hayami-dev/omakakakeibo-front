/**
 * @file 新規登録フローに関するメソッドを管理するサービス
 * @description ユーザーの新規登録についてのデータを加工、検証する
 */

import apiClient from "@/apiClient";
import handleApiError from "@/handleApiError";
import { updateBudget } from "./budgetService";

export const registerService = {
  /**
   * メアド認証用トークンを発行
   * @param {*} loginId
   */
  async registerRequest(loginId) {
    try {
      await apiClient.post(`/api/auth/register-request`, { loginId });
    } catch (error) {
      console.error("新規ユーザーのメアド送信に失敗...", error);
      handleApiError(error);
    }
  },
  /**
   * トークンを検証
   * @param {*} token
   * @returns
   */
  async registerValidToken(token) {
    try {
      const response = await apiClient.post(`/api/auth/verify-token`, {
        token,
      });
      return response.data;
    } catch (error) {
      console.error("新規ユーザー登録用トークン送信に失敗...", error);
      handleApiError(error);
      throw error;
    }
  },
  /**
   * 新規登録ユーザーの登録
   * @param {*} loginId
   * @param {*} password
   */
  async registerDataSave(loginId, password) {
    try {
      const sendData = {
        loginId,
        password,
      };

      const response = await apiClient.post("/api/auth/register", sendData);
      return response.data;
    } catch (error) {
      console.error("新規ユーザーの登録に失敗...", error);
      handleApiError(error);
      throw error;
    }
  },
};

export function validEmail(currentValue) {
  const strValue = String(currentValue || "");
  const value = strValue.trim();

  if (value === "") {
    return "メールアドレスを入力してください。";
  }

  if (value.length > 255) {
    return "メールアドレスが長すぎます。255文字以内で入力してください。";
  }

  // メールアドレスの形式チェック（正規表現パターン）
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(value)) {
    return "正しいメールアドレスの形式で入力してください。";
  }
  return "";
}

export function validPassword(currentValue) {
  const strValue = String(currentValue || "");
  const value = strValue.trim();

  if (value === "") {
    return "パスワードを入力してください。";
  }

  if (value.length < 8 || value.length > 12) {
    return "パスワードは8～12文字で入力してください。";
  }

  // 半角英数字・記号のみチェック（全角文字が混ざっていないか）
  const allowedCharsRegex = /^[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]+$/;
  if (!allowedCharsRegex.test(value)) {
    return "パスワードは半角英数字、および記号のみ使用できます。";
  }

  // アルファベット、数字、記号がそれぞれ最低1文字含まれているか（先読みの正規表現）
  const hasLetter = /[a-zA-Z]/.test(value);
  const hasDigit = /[0-9]/.test(value);
  const hasSymbol = /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(value);

  if (!hasLetter || !hasDigit || !hasSymbol) {
    return "アルファベット、数字、記号をそれぞれ最低1文字ずつ使用してください。";
  }

  return "";
}

/**
 * 最終データを各DBに入れる
 */
export async function saveUserData(formData) {
  const loginId = formData.loginId;
  const password = formData.password;

  // メアドのチェック
  const emailError = validEmail(loginId);
  if (emailError !== "") {
    // validEmail はエラーがない時 "" を返す
    alert(emailError);
    return;
  }

  // パスワードのチェック
  const passwordError = validPassword(password);
  if (passwordError !== "") {
    alert(passwordError);
    return;
  }

  const newUserId = await registerService.registerDataSave(loginId, password);
  if (!newUserId) {
    return;
  }

  // userIdを返す
  return newUserId;
}

/**
 * 最初の目標金額を登録する
 **/
export const firstBudgetSave = async (
  formData,
  newUserId,
  setMonthlyBudget,
) => {
  try {
    await updateBudget({
      inputValue: formData.targetAmount,
      userId: newUserId,
      currentMonth: formData.targetMonth,
      setMonthlyBudget,
    });
  } catch (error) {
    console.error(error);

    return "目標金額の初回登録に失敗しました。";
  }
};

/**
 * @file 新規登録フローに関するメソッドを管理するサービス
 * @description ユーザーの新規登録についてのデータを加工、検証する
 */

import apiClient from "@/apiClient";
import handleApiError from "@/handleApiError";

export const registerService = {
  /*
   * メアド認証用トークンを発行
   */
  async registerRequest(email) {
    try {
      await apiClient.post(`/api/auth/register-request`, { email });
    } catch (error) {
      console.error("新規ユーザーのメアド送信に失敗...", error);
      handleApiError(error);
    }
  },
};

export function isValidEmail(currentValue) {
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

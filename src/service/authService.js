/**
 * @file 認証・ユーザー（Auth）に関する状態を管理するサービス
 * @description アプリケーション全体で共有するユーザー認証状態（ユーザーID等）を保持する
 */

import { atomWithStorage } from "jotai/utils";
import apiClient from "@/apiClient";
import { atom } from "jotai";
import handleApiError from "@/handleApiError";

export const authService = {
  async fetchUserByLoginId(formData) {
    try {
      const sendData = {
        loginId: formData.loginId,
        password: formData.password,
      };

      const response = await apiClient.post(`/api/auth/login`, sendData);

      console.log("fetchUserByLoginId", response.data);

      return response.data;
    } catch (error) {
      console.error("ログインに失敗...", error);
      // あえて handleApiError(error) を呼ばず、エラーオブジェクトをそのまま上に投げる
      throw error;
    }
  },
  async fetchLoginUser() {
    try {
      const response = await apiClient.get(`/api/auth/me`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("未ログイン状態です");
        return null; // 失敗ではなく null を返す
      }
      console.error("ログイン情報の取得に失敗...", error);
      handleApiError(error);
      throw error;
    }
  },
  async fetchLogoutUser() {
    try {
      await apiClient.post(`/api/auth/logout`);
    } catch (error) {
      console.error(
        "ログアウト処理でエラーが発生しましたが強制終了します",
        error,
      );
    }
  },
};

/* ログイン状態を管理するAtom */
export const isLoggedInAtom = atomWithStorage("isLoggedIn", false);

/**
 * ログイン中のユーザーIDを管理するグローバルAtom状態
 * TODO：cookieをバックエンドで管理するため不要
 * @type {import('jotai').PrimitiveAtom<number>}
 */
export const userIdAtom = atomWithStorage("userId", null);
export const LoginIdAtom = atomWithStorage("loginId", "");

// 初期化を完了するAtom
export const isInitializedAtom = atom(false);

/**
 * ログインを実行
 */
export const login = async (formData) => {
  const msgId = validLoginId(formData.loginId);
  if (msgId !== "") {
    alert(msgId);
    return null;
  }

  const msgPass = validPassword(formData.password);
  if (msgPass !== "") {
    alert(msgPass);
    return null;
  }

  const response = await authService.fetchUserByLoginId(formData);
  return response;
};

/**
 * ログアウト
 */
export const logout = () => {
  // cookieを無効化
  authService.fetchLoginUser();

  // ローカルストレージを全て削除
  localStorage.clear();

  //  ブラウザをリロードして、Reactの状態を完全にリセットする
  window.location.href = "/auth/login";
};

/* ログインのバリデーション */
/**
 * ログインID
 * @param {*} userId
 * @returns テキスト or 空文字
 */
export const validLoginId = (id) => {
  if (!id || id === "") {
    return "ログインIDが入力されていません。";
  }

  return "";
};
/**
 * パスワード
 * @param {*} userId
 * @returns テキスト or 空文字
 */
export const validPassword = (password) => {
  if (!password || password === "") {
    return "パスワードが入力されていません。";
  }

  return "";
};

/**
 * @file 認証・ユーザー（Auth）に関する状態を管理するサービス
 * @description アプリケーション全体で共有するユーザー認証状態（ユーザーID等）を保持する
 */

import { atomWithStorage } from "jotai/utils";
import apiClient from "@/apiClient";
import { atom } from "jotai";

export const authService = {
  async fetchUserByLoginId(formData) {
    try {
      const sendData = {
        loginId: formData.loginId,
        password: formData.password,
      };

      const response = await apiClient.post(`/api/auth/login`, sendData);

      return response.data;
    } catch (error) {
      console.error("ログインに失敗...", error);
      // あえて handleApiError(error) を呼ばず、エラーオブジェクトをそのまま上に投げる
      throw error;
    }
  },
};

/* ログイン状態を管理するAtom */
export const isLoggedInAtom = atomWithStorage("isLoggedIn", false);

/**
 * ログイン中のユーザーIDを管理するグローバルAtom状態
 * TODO：ログイン機能が未実装の期間は、暫定の初期値として `1` を保持する
 * @type {import('jotai').PrimitiveAtom<number>}
 */
export const userIdAtom = atomWithStorage("userId", null);
export const LoginIdAtom = atomWithStorage("loginId", "");

// 初期化を完了するAtom
export const isInitializedAtom = atom(false);

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

  const userData = await authService.fetchUserByLoginId(formData);
  return userData;
};

/**
 * ログアウト
 */
export const logout = () => {
  // 1. ローカルストレージを全て削除（あるいは個別に削除）
  localStorage.removeItem("userId");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("loginId");

  // もし必要なら完全クリア
  // localStorage.clear();

  // 2. ブラウザをリロードして、Reactの状態を完全にリセットする
  // （これが一番確実で、ゴミデータが残らない方法です）
  window.location.href = "/auth/login";
};

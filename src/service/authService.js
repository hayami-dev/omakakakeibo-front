/**
 * @file 認証・ユーザー（Auth）に関する状態を管理するサービス
 * @description アプリケーション全体で共有するユーザー認証状態（ユーザーID等）を保持する
 */

import { atomWithStorage } from "jotai/utils";
import apiClient from "@/apiClient";
import handleApiError from "@/handleApiError";

export const authService = {
  /**
   * ログインIDとパスワードを使用して認証を行い、セッションを確立。
   * 成功時はサーバーから認証成功メッセージやユーザー情報が返る。
   * * @param {Object} formData - ログインフォームの入力データ
   * @param {string} formData.loginId - ユーザーのログインID
   * @param {string} formData.password - ユーザーのパスワード
   * @returns {Promise<Object>} APIからのレスポンスデータ
   * @throws {Error} 認証失敗時やネットワークエラー時に例外を投げる
   */
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
  /**
   * 現在のセッション状態を確認し、ログイン中のユーザー情報を取得。
   * サーバーが 401 Unauthorized を返した場合は「未ログイン」とみなし、null を返す。
   * * @returns {Promise<Object|null>} ログイン中ならユーザー情報オブジェクト、未ログインなら null
   * @throws {Error} 401 以外のサーバーエラーや通信エラー発生時に例外を投げる
   */
  async fetchLoginUserStatus() {
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
  /**
   * ログアウト処理を実行し、サーバー側のセッション（Cookieなど）を無効化。
   * * @returns {Promise<void>} 処理完了を返す
   */
  async fetchLogoutUser() {
    try {
      await apiClient.post(`/api/auth/logout`);
    } catch (error) {
      console.error(
        "ログアウト処理でエラーが発生しました。強制終了します",
        error,
      );
    }
  },
};

/* ログイン状態を管理するAtom */
export const isLoggedInAtom = atomWithStorage("isLoggedIn", false);

/* ログイン中のユーザーIDを管理するグローバルAtom状態 */
export const LoginIdAtom = atomWithStorage("loginId", "");

/* ユーザーの判定を管理するAtom
 * authenticated,unauthenticated,complete
 */
export const authStatusAtom = atomWithStorage("authStatus", "");

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
  authService.fetchLogoutUser();

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

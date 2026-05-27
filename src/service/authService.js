/**
 * @file 認証・ユーザー（Auth）に関する状態を管理するサービス
 * @description アプリケーション全体で共有するユーザー認証状態（ユーザーID等）を保持する
 */

import { atom } from "jotai";

/**
 * ログイン中のユーザーIDを管理するグローバルAtom状態
 * TODO：ログイン機能が未実装の期間は、暫定の初期値として `1` を保持する
 * @type {import('jotai').PrimitiveAtom<number>}
 */
export const userIdAtom = atom(1);

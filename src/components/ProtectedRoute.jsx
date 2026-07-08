/* ログイン状態をチェックするコンポーネント */

import {
  authService,
  authStatusAtom,
  isLoggedInAtom,
} from "@/service/authService";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  // ログイン情報を取得
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const setAuthStatus = useSetAtom(authStatusAtom);

  // データローディング中かを管理
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.fetchLoginUserStatus();
        // サーバーから取得したLoginIdが有効ならログイン状態にする(時間経過、一度URLを離れるなど)
        const isAuthenticated = !!user;
        setAuthStatus(user ? "authenticated" : "unauthenticated");
        setIsLoggedIn(isAuthenticated);
      } catch (error) {
        console.error(error);
        setAuthStatus("unauthenticated");
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) return <div className="w-full h-full bg-bg"></div>;

  // ログインしていなければリダイレクト
  if (!isLoggedIn) return <Navigate to="/auth/login" replace />;

  // ログイン済みならOutletへ
  return <Outlet />;
}

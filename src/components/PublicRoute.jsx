/* ログイン状態で/authの画面を表示しないようにする */

import { isLoggedInAtom } from "@/service/authService";
import { useAtomValue } from "jotai";
import { Navigate, Outlet } from "react-router";

export default function PublicRoute() {
  const isLoggedIn = useAtomValue(isLoggedInAtom);

  // ログイン済みなら、ログイン画面は見せずにホームへ飛ばす
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // 未ログインなら、そのままログイン画面を表示させる
  return <Outlet />;
}

/* ログイン状態をチェックするコンポーネント */

import { isLoggedInAtom } from "@/service/authService";
import { useAtomValue } from "jotai";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  const isLoggedIn = useAtomValue(isLoggedInAtom);

  const storedLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn && !storedLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }
  return <Outlet />;
}

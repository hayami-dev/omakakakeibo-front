/* ログイン状態をチェックするコンポーネント */

import { authService, isLoggedInAtom } from "@/service/authService";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router";

export default function ProtectedRoute() {
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    authService
      .fetchLoginUser()
      .then((user) => {
        if (user) {
          setIsLoggedIn(true);
          navigate("/");
        } else if (!user) {
          setIsLoading(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((error) => {
        setIsLoggedIn(false);
        console.log("catch側の時", error);
        navigate("/auth/login");
      })
      .finally(() => {
        setIsLoading(false); // 通信が終わったらローディングを解除
      });
  }, []);

  if (isLoading) {
    return <div className="text-center p-4">読み込み中...</div>;
  }

  if (!isLoading && !isLoggedIn) {
    return <Navigate to="/auth/login" />;
  }
  return <Outlet />;
}

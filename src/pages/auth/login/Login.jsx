/* ログインページ */
import { useNavigate } from "react-router";

import logo from "@/assets/logo.svg";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "@/service/authService";

export default function Login() {
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  console.log("isLoggedIn", isLoggedIn);

  const navigate = useNavigate();
  const handleDummyLogin = (e) => {
    e.preventDefault();

    // 1️⃣ ログイン状態を「true（ログイン済み）」に書き換える！
    setIsLoggedIn(true);

    // 2️⃣ そのままホーム画面にジャンプ！
    navigate("/");
  };

  // 処理
  return (
    <>
      <main className="flex flex-col gap-4">
        <img src={logo} alt="" className="w-[120px]" />
        <h1>ログイン</h1>
        <form action="">
          <label htmlFor="userId">ユーザーID</label>
          <TextField />
          <label htmlFor="pass">パスワード</label>
          <TextField />
        </form>
        <Button onClick={handleDummyLogin}>ログイン</Button>
        <Button type="text">パスワードを忘れた方はこちら</Button>
        <hr />
        <p>ご利用にはアカウントが必要です</p>
        <Button onClick={() => navigate("/auth/register")}>
          新規アカウント登録
        </Button>
      </main>
    </>
  );
}

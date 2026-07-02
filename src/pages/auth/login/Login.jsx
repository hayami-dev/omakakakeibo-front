/* ログインページ */
import { useState } from "react";
import { useNavigate } from "react-router";

import logo from "@/assets/logo.svg";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import { useSetAtom } from "jotai";
import {
  isLoggedInAtom,
  validLoginId,
  validPassword,
  login,
} from "@/service/authService";
import EyeIcon from "@/assets/icons/eye.svg";
import EyeOffIcon from "@/assets/icons/eye-off.svg";
import { toastAtom } from "@/service/toastAtom";

export default function Login() {
  const setIsLoggedIn = useSetAtom(isLoggedInAtom);

  const [loginIdValue, setLoginIdValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const [errorTextUserId, setErrorTextUserId] = useState("");
  const [errorTextPassword, setErrorTextPassword] = useState("");

  // トースト通知書き換えるためのatom
  const setToast = useSetAtom(toastAtom);

  // パスワードの入力のマスク管理
  const [isPassShow, setIsPassShow] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPassShow((prev) => !prev);
  };

  // 2つのフォームのバリデーションを同時に走らせる
  const validateAll = (
    currentLoginId = loginIdValue,
    currentPassword = passwordValue,
  ) => {
    const userIdMsg = validLoginId(currentLoginId);
    const passwordMsg = validPassword(currentPassword);

    setErrorTextUserId(userIdMsg);
    setErrorTextPassword(passwordMsg);

    // 送信ボタンの制御などで使いたい場合は、両方エラーなしならtrueを返す
    return userIdMsg === "" && passwordMsg === "";
  };

  // メールアドレスの onBlur
  const handleValidUserId = (e) => {
    if (e) e.preventDefault();
    validateAll(e.target.value, passwordValue); // 自動入力でお互い同時に値が入っても、これで両方チェックできる
  };

  // パスワードの onBlur
  const handleValidPassword = (e) => {
    if (e) e.preventDefault();
    validateAll(loginIdValue, e.target.value); // 同上
  };

  const navigate = useNavigate();

  const onHandleLogin = async (e) => {
    e.preventDefault();

    try {
      const isValid = validateAll();

      // どちらかにエラーがあれば、ここで処理を止めてAPI通信にいかせない
      if (!isValid) {
        return;
      }

      const formData = {
        loginId: loginIdValue,
        password: passwordValue,
      };
      const userData = await login(formData);

      // TODO:200OKじゃなかったら、に書き換える
      if (userData == null || !userData) {
        setToast({
          show: true,
          message:
            "ログインできませんでした。\nユーザーID、パスワードを再度ご確認ください。",
          type: "",
        });
        return;
      }

      // ログイン状態を書き換える
      setIsLoggedIn(true);

      // そのままホーム画面にジャンプ！
      alert("ログイン成功！" + userData);
      // navigate("/");
    } catch (error) {
      console.error(error);

      // ここで400エラーを受け止める！
      // Axiosのエラーオブジェクトから、Javaが返してくれた生のエラー文を取り出す
      const errorMessage =
        error.response?.data || "ログイン情報が正しくありません。";

      setToast({
        show: true,
        message: errorMessage,
        type: "error",
      });
    }
  };

  // 処理
  return (
    <>
      <main className="flex flex-col gap-8 px-8 py-12 items-center bg-bg h-full">
        <img src={logo} alt="" className="w-[120px]" />
        <h1>ログイン</h1>
        <div className="w-full flex flex-col gap-8 pb-8 border-dot-underline">
          <form onSubmit={onHandleLogin} className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <fieldset className=" flex flex-col gap-2">
                <label htmlFor="user-id" className="text-sm">
                  ログインID
                </label>
                <TextField
                  type="text"
                  id="user-id"
                  value={loginIdValue}
                  onChange={setLoginIdValue}
                  onBlur={handleValidUserId}
                  minLength="1"
                  isError={errorTextUserId}
                />
                <p className="text-error-default">{errorTextUserId}</p>
              </fieldset>
              <fieldset className="flex flex-col gap-2">
                <label htmlFor="pass" className="text-sm">
                  パスワード
                </label>
                <div className="relative">
                  <TextField
                    type={isPassShow ? "text" : "password"}
                    id="pass"
                    value={passwordValue}
                    onChange={setPasswordValue}
                    onBlur={handleValidPassword}
                    className=""
                    minLength="1"
                    isError={errorTextPassword}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-[99]"
                  >
                    {isPassShow ? (
                      <img src={EyeIcon} alt="表示" className="" />
                    ) : (
                      <img src={EyeOffIcon} alt="非表示" className="" />
                    )}
                  </button>
                </div>
                <p className="text-error-default">{errorTextPassword}</p>
              </fieldset>
            </div>
            <Button type="submit">ログイン</Button>
          </form>
          <Button type="button" variant="text" size="sm">
            パスワードを忘れた方はこちら(未実装)
          </Button>
        </div>
        <div className="w-full flex flex-col gap-6 text-center">
          <p>ご利用にはアカウントが必要です</p>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/auth/register")}
          >
            新規アカウント登録
          </Button>
        </div>
      </main>
    </>
  );
}

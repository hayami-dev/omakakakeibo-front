/* 新規登録フロー：メアド(ログインID)の入力 */
import { useState } from "react";
// コンポーネント
import BasePage from "@/components/ui/BasePage";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
// アセット
import EyeIcon from "@/assets/icons/eye.svg";
import EyeOffIcon from "@/assets/icons/eye-off.svg";
import { validPassword } from "@/service/registerService";

export default function RegisterPassword({ nextStep, formData, setFormData }) {
  // メアドの入力値を取得
  const loginId = formData.loginId;

  // パスワードの入力値を管理
  const [passwordValue, setPasswordValue] = useState(formData.password);

  // エラーテキストを管理
  const [errorText, setErrorText] = useState("");

  // パスワードの入力のマスク管理
  const [isPassShow, setIsPassShow] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPassShow((prev) => !prev);
  };

  const validateEmail = () => {
    const msg = validPassword(passwordValue);
    setErrorText(msg);
    return msg;
  };

  const onHandleValid = () => {
    validateEmail(passwordValue);
  };

  const onHandleSend = (e) => {
    e.preventDefault();

    const msg = validateEmail(passwordValue);
    if (msg !== "") {
      return; // エラーがあれば進ませない
    }

    setFormData({ ...formData, password: passwordValue });
    nextStep();
  };

  return (
    <>
      <BasePage title={"ログイン情報の登録"}>
        <div>
          <p>
            メール認証が完了しました。
            <br />
            <br />
            続いて、ログインパスワードを設定してください。
          </p>
        </div>
        <form className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <p className="text-sm">ログインID</p>
            <p>{loginId}</p>
          </div>
          <fieldset className="flex flex-col gap-2">
            <label htmlFor="pass" className="text-sm">
              パスワード
            </label>
            <div className="relative">
              <TextField
                type={isPassShow ? "text" : "password"}
                id="pass"
                value={passwordValue}
                onBlur={(value) => onHandleValid(value)}
                onChange={setPasswordValue}
                className=""
                size="md"
                maxLength="12"
                minLength="8"
                isError={errorText !== ""}
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
            <p className="text-error-default">{errorText}</p>
            <div className="text-xs text-text-cap tracking-normal">
              <p>※半角英数字で8文字以上、12文字以内で入力してください</p>
              <p>
                ※アルファベット、数字、記号をそれぞれ1文字ずつ使用してください
              </p>
            </div>
          </fieldset>
          <Button onClick={onHandleSend}>次へ</Button>
        </form>
      </BasePage>
    </>
  );
}

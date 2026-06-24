/* 新規登録フロー：メアド(ログインID)の入力 */
import { useState } from "react";
// コンポーネント
import BasePage from "@/components/ui/BasePage";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
// アセット
import ChevronRightIcon from "@/assets/icons/ChevronRightIcon";
import { isValidEmail, registerService } from "@/service/registerService";
import { useNavigate } from "react-router";

export default function RegisterEmail({ nextStep, formData, setFormData }) {
  const [emailValue, setEmailValue] = useState(formData.email);
  const [errorText, setErrorText] = useState("");

  const navigate = useNavigate();

  // 画面を開いた瞬間（未入力）はエラー文はないけど進ませない、入力されてエラーがなければOK
  const isButtonDisabled = emailValue.trim() === "" || errorText !== "";

  const validateEmail = (value) => {
    const msg = isValidEmail(value);
    setErrorText(msg);
    return msg;
  };

  const onHandleValid = () => {
    validateEmail(emailValue);
  };

  const onHandleSend = async (e) => {
    e.preventDefault();

    const msg = validateEmail(emailValue);
    if (msg !== "") {
      return; // エラーがあれば進ませない
    }

    await registerService.registerRequest(emailValue);
    // このメソッドが完了時点でsetされる
    setFormData({ ...formData, email: emailValue });

    nextStep();
  };

  return (
    <>
      <BasePage title={"新規アカウントの登録"}>
        <div>
          <p>
            メールアドレスを入力してください。
            <br />
            <br />
            入力したメールアドレスは、
            <br />
            ログインに必要なユーザーIDになります。
          </p>
        </div>
        <form
          onSubmit={onHandleSend}
          className="flex flex-col gap-2 pb-8 border-dot-underline"
        >
          <label htmlFor="email">メールアドレス</label>
          <TextField
            type="email"
            id="email"
            placeholder={"yamada@example.com"}
            value={emailValue}
            onBlur={(value) => onHandleValid(value)}
            onChange={setEmailValue}
            className=""
            size="md"
            maxLength="255"
            minLength="5"
            isError={errorText !== ""}
          />
          <p className="text-error-default">{errorText}</p>
          <Button type="submit" disabled={isButtonDisabled}>
            認証メールを送信する
          </Button>
        </form>
        <div>
          <div />
          <Button
            variant="secondary"
            icon={
              <span className="inline-block rotate-180">
                <ChevronRightIcon />
              </span>
            }
            onClick={() => navigate(-1)}
          >
            ログイン画面へ戻る
          </Button>
        </div>
      </BasePage>
    </>
  );
}

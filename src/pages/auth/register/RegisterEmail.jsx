/* 新規登録フロー：メアド(ログインID)の入力 */
import BasePage from "@/components/ui/BasePage";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

export default function RegisterEmail({ nextStep }) {
  const onHandleSend = (e) => {
    e.preventDefault();
    nextStep(); // 関数実行するだけ
  };

  return (
    <>
      <BasePage title={"新規アカウントの登録"}>
        <div>
          <p>
            メールアドレスを入力してください。
            <br />
            入力したメールアドレスは、ログインに必要なユーザーIDになります。
          </p>
        </div>
        <form>
          <fieldset>
            <label htmlFor="">メールアドレス</label>
            <TextField />
          </fieldset>
          <Button onClick={onHandleSend}>認証メールを送信する</Button>
        </form>
        <div>
          <hr />
          <Button>ログイン画面へ戻る</Button>
        </div>
      </BasePage>
    </>
  );
}

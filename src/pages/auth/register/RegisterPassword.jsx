/* 新規登録フロー：メアド(ログインID)の入力 */
import BasePage from "@/components/ui/BasePage";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

export default function RegisterPassword({ nextStep }) {
  const onHandleSend = (e) => {
    e.preventDefault();
    nextStep(); // 関数実行するだけ
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
        <form>
          <div>
            <p>ユーザーID</p>
            <p>yamada@exsample.jp</p>
          </div>
          <fieldset>
            <label htmlFor="">パスワード</label>
            <TextField />
            <span>※半角英数字で8文字以上、12文字以内で入力してください</span>
            <span>
              ※アルファベット、数字、記号をそれぞれ1文字ずつ使用してください
            </span>
          </fieldset>
          <Button onClick={onHandleSend}>次へ</Button>
        </form>
      </BasePage>
    </>
  );
}

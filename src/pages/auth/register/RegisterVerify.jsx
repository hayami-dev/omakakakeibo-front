/* 新規登録フロー：認証メール送信後の画面 */

import BasePage from "@/components/ui/BasePage";
import Button from "@/components/ui/Button";

export default function RegisterVerify({ nextStep }) {
  const onHandleSend = (e) => {
    e.preventDefault();
    nextStep(); // 関数実行するだけ
  };

  return (
    <>
      <BasePage title={"認証メール送信完了"}>
        <p>
          入力したメールアドレスへ認証メールを送信しました。
          <br />
          メールに記載されているURLから認証してください。
        </p>
        <div>
          <p>しばらく経ってもメールが届かない方は 再送してください。</p>
          <Button>認証メールを再送する</Button>
          <Button onClick={onHandleSend}>debug:パスワードの入力へ</Button>
        </div>
        <div>
          <hr />
          <Button>ログイン画面へ戻る</Button>
        </div>
      </BasePage>
    </>
  );
}

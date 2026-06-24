/* 新規登録フロー：メアド(ログインID)の入力 */
import BasePage from "@/components/ui/BasePage";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

export default function RegisterComplete() {
  return (
    <>
      <BasePage title={"アカウント登録完了！"}>
        <div>
          <p>
            アカウントの登録、おつかれさまでした。
            <br />
            <br />
            毎日つづけるには、気負わないで
            <br />
            「おおまかに」きろくするのがコツです。
            <br />
            <br />
            いっしょにがんばっていきましょう！
          </p>
        </div>
        <Button>ホームへすすむ</Button>
      </BasePage>
    </>
  );
}

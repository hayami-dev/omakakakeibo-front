/* 新規登録フロー：認証メール送信後の画面 */

import { useNavigate, useSearchParams } from "react-router";
// コンポーネント
import BasePage from "@/components/ui/BasePage";
import Button from "@/components/ui/Button";
// アセット
import ChevronRightIcon from "@/assets/icons/ChevronRightIcon";
import { registerService } from "@/service/registerService";
import { useEffect } from "react";

export default function RegisterVerify({ nextStep, formData }) {
  // 前のページでの入力を取得
  const emailValue = formData.loginId;

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    // トークンが無ければ何もしない
    if (!token) return;

    const verifyToken = async () => {
      try {
        // Java側にトークン検証APIを叩く（後で作るAPI）

        console.log("トークン検証成功！次の画面へ進みます。トークン:", token);
        alert("メール認証が成功しました！パスワードを設定してください。");
        nextStep();
      } catch (error) {
        console.error(error);
        alert(
          "トークンの有効期限が切れているか、無効なURLです。再送してください。",
        );
      }
    };
    verifyToken();
  }, [token]);

  // 認証トークンを再発行
  const onHandleSend = async () => {
    await registerService.registerRequest(emailValue);
  };

  return (
    <>
      <BasePage title={"認証メール送信完了"}>
        <div className="flex flex-col gap-12 pb-8 border-dot-underline">
          <p>
            入力したメールアドレスへ認証メールを送信しました。
            <br />
            <br />
            メールに記載されているURLから認証してください。
          </p>
          <div>
            <p className="text-sm text-center">
              しばらく経ってもメールが届かない方は
              <br />
              再送してください。
            </p>
            <Button onClick={onHandleSend}>認証メールを再送する</Button>
          </div>
        </div>
        <div>
          <Button
            variant="secondary"
            icon={
              <span className="inline-block rotate-180">
                <ChevronRightIcon />
              </span>
            }
            onClick={() => navigate("/auth/login")}
          >
            ログイン画面へ戻る
          </Button>
        </div>
      </BasePage>
    </>
  );
}

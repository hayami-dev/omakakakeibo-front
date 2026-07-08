/* 新規登録フロー：メアド(ログインID)の入力 */
import BasePage from "@/components/ui/BasePage";
import Button from "@/components/ui/Button";
import { useSetAtom } from "jotai";
import { useNavigate } from "react-router";
import ChevronRightIcon from "@/assets/icons/ChevronRightIcon";
import { isLoggedInAtom, LoginIdAtom } from "@/service/authService";

export default function RegisterComplete({ registerCompleteStatus }) {
  // ログイン状態を取得
  const setIsLoggedIn = useSetAtom(isLoggedInAtom);

  // 保存中の間、ローディング画面を表示
  const isSaving = !registerCompleteStatus;
  console.log("registerCompleteStatus", registerCompleteStatus);

  // 画面遷移のフック
  const navigate = useNavigate();

  /**
   * 新規登録フロー
   */
  const moveHome = () => {
    // ログイン状態に変化
    setIsLoggedIn(true);
    navigate("/");
  };

  return (
    <>
      <BasePage title={"アカウント登録完了！"}>
        {isSaving ? (
          <div className="flex flex-col gap-8">
            <p className="text-main-default animate-pulse text-center">
              アカウントを作成中...
            </p>
            <p className="text-center">
              しばらく経っても動かない場合は、
              <br />
              ログイン画面へ戻り、ログインを試してみてください。
            </p>
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
        ) : (
          <div>
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
            <Button type="button" onClick={moveHome} className="mt-8">
              ホームへすすむ
            </Button>
          </div>
        )}
      </BasePage>
    </>
  );
}

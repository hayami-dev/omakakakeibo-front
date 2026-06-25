/* 新規登録フロー：メアド(ログインID)の入力 */
import BasePage from "@/components/ui/BasePage";
import Button from "@/components/ui/Button";
import { monthlyBudgetAtom, updateBudget } from "@/service/budgetService";
import { saveUserData } from "@/service/registerService";
import { useSetAtom } from "jotai";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import ChevronRightIcon from "@/assets/icons/ChevronRightIcon";
import { userIdAtom } from "@/service/authService";

export default function RegisterComplete({ formData }) {
  // 目標金額をセット
  const setMonthlyBudget = useSetAtom(monthlyBudgetAtom);

  //
  const setUserId = useSetAtom(userIdAtom);

  // 保存中の間、ローディング画面を表示
  const [isSaving, setIsSaving] = useState(true);

  // 保存メソッドが走ったかどうか
  const isRun = useRef(false);

  const navigate = useNavigate();

  // 指定したミリ秒（ms）だけ処理を待たせる関数
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // 新規ユーザー登録を走らせる
  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true; // 1回目が通ったら即座にフラグを立てる

    const runFinalSave = async () => {
      try {
        const [newUserId] = await Promise.all([
          saveUserData(formData),
          delay(2000), // 最低限3秒間はここでキープされる
        ]);

        if (!newUserId) {
          setIsSaving(false);
          return;
        }

        const targetAmount = formData.targetAmount;
        const targetMonth = formData.targetMonth;

        await updateBudget({
          inputValue: targetAmount,
          USER_ID: newUserId,
          currentMonth: targetMonth,
          setMonthlyBudget,
        });
        setUserId(newUserId);

        setIsSaving(false);
      } catch (error) {
        console.error("最終登録で予期せぬエラー:", error);
        setIsSaving(false);
        alert("予期せぬエラーが発生しました。");
      }
    };
    runFinalSave();
  }, [formData]);

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
            <Button
              type="button"
              onClick={() => navigate("/")}
              className="mt-8"
            >
              ホームへすすむ
            </Button>
          </div>
        )}
      </BasePage>
    </>
  );
}

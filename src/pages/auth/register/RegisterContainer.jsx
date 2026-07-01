/* 新規登録フローのコンテナ */

import { useEffect, useState } from "react";
// ヘッダーのインポート
import Header from "@/components/Header";
// 各ページのインポート
import RegisterEmail from "./RegisterEmail";
import RegisterVerify from "./RegisterVerify";
import RegisterPassword from "./RegisterPassword";
import BudgetEdit from "@/pages/user/BudgetEdit";
import RegisterComplete from "./RegisterComplete";
import {
  firstBudgetSave,
  registerService,
  saveUserData,
} from "@/service/registerService";
import { useLocation, useSearchParams } from "react-router";
import { useSetAtom } from "jotai";
import { monthlyBudgetAtom } from "@/service/budgetService";
import { isLoggedInAtom, LoginIdAtom, userIdAtom } from "@/service/authService";

export default function RegisterContainer() {
  // 目標金額をセット
  const setMonthlyBudget = useSetAtom(monthlyBudgetAtom);

  // ユーザーIDを取得
  const setUserId = useSetAtom(userIdAtom);

  // ログインIDを取得
  const setLoginId = useSetAtom(LoginIdAtom);

  // ログイン状態を取得
  const setIsLoggedIn = useSetAtom(isLoggedInAtom);

  // URLを検知
  const location = useLocation();
  // URLのtoken部分を取得
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  // 最初表示するページ
  const [step, setStep] = useState(token ? 3 : 1);

  // 送信するデータ
  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
    targetAmount: 50000,
    targetMonth: "",
  });

  /**
   * トークンをチェック
   */
  useEffect(() => {
    if (location.pathname === "/auth/register/verify" && token) {
      const autoVerify = async () => {
        try {
          const res = await registerService.registerValidToken(token);
          if (res && res.loginId) {
            setFormData((prev) => ({ ...prev, loginId: res.loginId }));
            setStep(3);
          }
        } catch (error) {
          console.error(error);
          alert(
            "トークンの有効期限切れ、または無効なURLです。再度メアドを入力してください。",
          );
          setStep(1);
        }
      };
      autoVerify();
    }
  }, [location, token]);

  useEffect(() => {
    /**
     * 新規登録フロー
     */
    const runRegister = async (formData) => {
      try {
        const newUserId = await saveUserData(formData);

        const newLoginId = formData.loginId;

        if (!newUserId) {
          alert("新しいユーザーIDが発行されていません。");
        }

        await firstBudgetSave(formData, newUserId, setMonthlyBudget);

        setUserId(newUserId);
        setLoginId(newLoginId);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("最終登録で予期せぬエラー:", error);
        alert("予期せぬエラーが発生しました。");
      }
    };

    if (step === 5) {
      runRegister(formData);
    }
  }, [step, formData]);

  // ページ切替
  const nextStep = () => setStep((prev) => prev + 1);

  return (
    <>
      <Header />
      {step === 1 && (
        <RegisterEmail
          nextStep={nextStep}
          formData={formData}
          setFormData={setFormData}
        />
      )}
      {step === 2 && <RegisterVerify nextStep={nextStep} formData={formData} />}
      {step === 3 && (
        <RegisterPassword
          nextStep={nextStep}
          formData={formData}
          setFormData={setFormData}
        />
      )}
      {step === 4 && (
        <BudgetEdit
          nextStep={nextStep}
          formData={formData}
          setFormData={setFormData}
        />
      )}
      {step === 5 && <RegisterComplete />}
    </>
  );
}

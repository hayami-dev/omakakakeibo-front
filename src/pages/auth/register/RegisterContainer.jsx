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
import { registerService } from "@/service/registerService";
import { useLocation, useSearchParams } from "react-router";

export default function RegisterContainer() {
  // 最初表示するページ
  const [step, setStep] = useState(1);
  // URLを検知
  const location = useLocation();
  // URLのtoken部分を取得
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // 送信するデータ
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    targetAmount: 50000,
    targetMonth: "",
  });

  useEffect(() => {
    if (location.pathname === "/auth/register/verify" && token) {
      const autoVerify = async () => {
        try {
          const res = await registerService.registerValidToken(token);
          if (res && res.email) {
            setFormData((prev) => ({ ...prev, email: res.email }));
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

  // ページ切替
  const nextStep = () => setStep((prev) => prev + 1);

  // TODO:削除
  console.log("formData", formData);

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
      {step === 5 && <RegisterComplete formData={formData} />}
    </>
  );
}

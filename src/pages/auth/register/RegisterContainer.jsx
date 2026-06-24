/* 新規登録フローのコンテナ */

import { useState } from "react";
// ヘッダーのインポート
import Header from "@/components/Header";
// 各ページのインポート
import RegisterEmail from "./RegisterEmail";
import RegisterVerify from "./RegisterVerify";
import RegisterPassword from "./RegisterPassword";
import BudgetEdit from "@/pages/user/BudgetEdit";
import RegisterComplete from "./RegisterComplete";

export default function RegisterContainer() {
  // 最初表示するページ
  const [step, setStep] = useState(1);

  // 送信するデータ
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    targetAmount: 50000,
  });

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
      {step === 2 && <RegisterVerify nextStep={nextStep} />}
      {step === 3 && <RegisterPassword nextStep={nextStep} />}
      {step === 4 && <BudgetEdit nextStep={nextStep} />}
      {step === 5 && <RegisterComplete />}
    </>
  );
}

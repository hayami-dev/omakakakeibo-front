/* ユーザー情報を表示する画面 */

import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { useNavigate } from "react-router";
// Service
import { activeCategoriesAtom } from "@/service/categoryService";
import { currentMonthAtom } from "@/service/historyService";
import {
  budgetService,
  monthlyBudgetAtom,
  INITIAL_MONTHLY_BUDGET,
} from "@/service/budgetService";
import { userIdAtom } from "@/service/authService";
// components
import Button from "@/components/ui/Button";
import EditIcon from "@/assets/icons/EditIcon";
import CategoryButton from "@/components/ui/CategoryButton";

// ユーザー個別の情報の表示画面
export default function User() {
  // ユーザーIDを取得
  const USER_ID = useAtomValue(userIdAtom);

  // 選択中の月
  const currentMonth = useAtomValue(currentMonthAtom);
  // 目標金額の取得
  const setMonthlyBudget = useSetAtom(monthlyBudgetAtom);

  // カテゴリ一覧を取得
  const activeCategories = useAtomValue(activeCategoriesAtom);

  // 目標金額を取得
  const monthlyBudget = useAtomValue(monthlyBudgetAtom);

  // ページ切替のためのフック
  const navigate = useNavigate();

  // DBから目標金額を取得
  useEffect(() => {
    const loadBudget = async () => {
      if (monthlyBudget !== INITIAL_MONTHLY_BUDGET && monthlyBudget !== 0) {
        return;
      }
      const amount = await budgetService.loadBudgetWithFallback(
        USER_ID,
        currentMonth,
      );
      setMonthlyBudget(amount);
    };
    loadBudget();
  }, [currentMonth]);

  // 処理
  return (
    <main className="flex flex-col gap-7 w-full p-space-600">
      <h1 className="text-center">ユーザー情報</h1>
      <section className="w-full flex flex-col gap-6 border-dot-underline pb-space-600">
        <h2 className="flex justify-between items-baseline bg-bg-section2 px-space-600 py-space-400 rounded-3xl">
          <span>目標金額</span>
          <span>
            <strong className="text-2xl pr-[0.25rem]">
              {monthlyBudget.toLocaleString()}
            </strong>
            円
          </span>
        </h2>
        <Button
          variant="secondary"
          size="sm"
          icon={EditIcon}
          onClick={() => navigate("/user/budgetEdit")}
        >
          目標金額を変更する
        </Button>
      </section>
      <section className="w-full flex flex-col gap-6 border-dot-underline pb-space-600 text-center">
        <h2>カテゴリーの一覧</h2>
        <div className="grid grid-cols-12 gap-2 items-center">
          {activeCategories
            .filter((cat) => cat.categoryName !== "")
            .map((cat, index) => (
              <div key={cat.activeCatId || index} className="col-span-6">
                <CategoryButton
                  catName={cat.categoryName}
                  catStyle={cat.style}
                  readOnly
                />
              </div>
            ))}
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={EditIcon}
          onClick={() => navigate("/user/categoryEdit")}
        >
          カテゴリーを変更する
        </Button>
      </section>
      <section className="flex flex-col gap-2">
        <h3>ユーザーID</h3>
        <p>yamada@exsample.jp</p>
        <Button
          variant="secondary"
          size="sm"
          icon={EditIcon}
          className="!w-fit mt-2"
          onClick={() => navigate("/")}
        >
          ユーザーIDの変更
        </Button>
      </section>
      <section className="flex flex-col gap-3">
        <h3>パスワード</h3>
        <p>●●●●●●●●</p>
        <Button
          variant="secondary"
          size="sm"
          icon={EditIcon}
          className="!w-fit mt-3"
          onClick={() => navigate("/")}
        >
          パスワードの変更
        </Button>
      </section>
    </main>
  );
}

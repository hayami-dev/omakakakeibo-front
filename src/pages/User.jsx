/* ユーザー情報を表示する画面 */

import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { useNavigate } from "react-router";
// Service
import {
  activeCategoriesAtom,
  categoriesMasterAtom,
  checkAlreadyEditCategory,
} from "@/service/categoryService";
import {
  budgetService,
  monthlyBudgetAtom,
  INITIAL_MONTHLY_BUDGET,
  checkIsEditBudget,
} from "@/service/budgetService";
import { LoginIdAtom, logout } from "@/service/authService";
// components
import Button from "@/components/ui/Button";
import EditIcon from "@/assets/icons/EditIcon";
import CategoryButton from "@/components/ui/CategoryButton";
import AttentionText from "@/components/ui/HelpText";
import { getYearMonth } from "@/dateUtils";

// ユーザー個別の情報の表示画面
export default function User() {
  // ログインIDを取得
  const loginId = useAtomValue(LoginIdAtom);

  // 目標金額の取得
  const setMonthlyBudget = useSetAtom(monthlyBudgetAtom);

  // カテゴリ一覧を取得
  const activeCategories = useAtomValue(activeCategoriesAtom);
  const categoriesMaster = useAtomValue(categoriesMasterAtom);

  // 目標金額を取得
  const monthlyBudget = useAtomValue(monthlyBudgetAtom);

  // 今月を取得
  const currentMonth = getYearMonth();

  // 目標金額の変更が可能かどうかの判定
  const [isEditBudget, setIsEditBudget] = useState(false);

  //カテゴリの変更が可能かどうか
  const today = new Date();
  const isEditCategory = checkAlreadyEditCategory(
    today,
    activeCategories,
    categoriesMaster,
  );

  // ページ切替のためのフック
  const navigate = useNavigate();

  // 目標金額の変更が可能かどうかを判定
  useEffect(() => {
    const checkBudgetLock = async () => {
      const canEdit = await checkIsEditBudget(currentMonth);
      setIsEditBudget(canEdit);
    };

    checkBudgetLock();
  }, [currentMonth, monthlyBudget]);

  // DBから目標金額を取得
  useEffect(() => {
    const loadBudget = async () => {
      if (monthlyBudget !== INITIAL_MONTHLY_BUDGET && monthlyBudget !== 0) {
        return;
      }
      const amount = await budgetService.loadBudgetWithFallback(currentMonth);
      setMonthlyBudget(amount);
    };
    loadBudget();
  }, [currentMonth, monthlyBudget]);

  const handleLogout = () => {
    if (window.confirm("ログアウトしますか？")) {
      logout();
    }
  };

  // 処理
  return (
    <main className="flex flex-col gap-7 w-full p-8">
      <h1 className="text-center">ユーザー情報</h1>
      <section className="w-full flex flex-col gap-6 border-dot-underline pb-8">
        <h2 className="flex justify-between items-baseline bg-bg-section2 px-8 py-4 rounded-3xl">
          <span>目標金額</span>
          <span>
            <strong className="text-2xl pr-[0.25rem]">
              {monthlyBudget.toLocaleString()}
            </strong>
            円
          </span>
        </h2>
        <div className="w-full flex flex-col items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={EditIcon}
            onClick={() => navigate("/user/budgetEdit")}
            disabled={!isEditBudget}
          >
            目標金額を変更する
          </Button>
          {!isEditBudget && <AttentionText>今月は変更済みです。</AttentionText>}
        </div>
      </section>
      <section className="w-full flex flex-col gap-6 border-dot-underline pb-8 text-center">
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
        <div className="w-full flex flex-col items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={EditIcon}
            onClick={() => navigate("/user/categoryEdit")}
            disabled={!isEditCategory}
          >
            カテゴリーを変更する
          </Button>
          {!isEditCategory && (
            <AttentionText>今月は変更済みです。</AttentionText>
          )}
        </div>
      </section>
      <section className="flex flex-col gap-2">
        <h3>ユーザーID</h3>
        <p>{loginId}</p>
        <Button
          variant="secondary"
          size="sm"
          icon={EditIcon}
          className="!w-fit mt-2"
          onClick={() => navigate("/")}
        >
          ユーザーIDの変更(未実装)
        </Button>
      </section>
      <section className="flex flex-col gap-3 border-dot-underline pb-8">
        <h3>パスワード</h3>
        <p>●●●●●●●●</p>
        <Button
          variant="secondary"
          size="sm"
          icon={EditIcon}
          className="!w-fit mt-3"
          onClick={() => navigate("/")}
        >
          パスワードの変更(未実装)
        </Button>
      </section>
      <div className="pb-4">
        <Button type="button" onClick={handleLogout}>
          ログアウト
        </Button>
      </div>
    </main>
  );
}

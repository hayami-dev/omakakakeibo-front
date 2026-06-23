/* ユーザー毎のカテゴリの変更画面 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAtom, useSetAtom } from "jotai";
import {
  activeCategoriesAtom,
  categoriesMasterAtom,
  checkAlreadyEditCategory,
  updateCategories,
} from "@/service/categoryService";
import { getSafeColor } from "@/categoryColor";
import BasePage from "@/components/ui/BasePage";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import AlertCircleIcon from "@/assets/icons/AlertCircleIcon";
import AttentionText from "@/components/ui/HelpText";
import { toastAtom } from "@/service/toastAtom";
import handleApiError from "@/handleApiError";

export default function CategoryEdit() {
  // アクティブなカテゴリを取得
  const [activeCategories, setActiveCategories] = useAtom(activeCategoriesAtom);

  // カテゴリマスタのセッターを取得
  const setCategoriesMaster = useSetAtom(categoriesMasterAtom);

  // 一時変更用のカテゴリリスト
  const [localCategories, setLocalCategories] = useState(activeCategories);

  //カテゴリの変更が可能かどうか
  const today = new Date();
  const isEdit = checkAlreadyEditCategory(today, activeCategories);

  // トースト通知書き換えるためのatom
  const setToast = useSetAtom(toastAtom);

  // 目標金額の変更（ロード完了など）と同時にinputValueに挿入
  useEffect(() => {
    setLocalCategories(activeCategories);
  }, [activeCategories]);

  // リアルタイムで変更を監視
  // 渡されたcat.activeCatId,e.target.valueをそれぞれ引数へ
  const handleInputChange = (id, newName) => {
    setLocalCategories((prev) =>
      prev.map((cat) =>
        cat.activeCatId === id ? { ...cat, categoryName: newName } : cat,
      ),
    );
  };

  // activeCategoriesに空欄がいくつ含まれているかをカウント
  function handleCheckCategoryName() {
    const emptyCount = localCategories.filter(
      (cat) => !cat.categoryName || cat.categoryName.trim() === "",
    ).length;

    return emptyCount;
  }

  // 入力されたカテゴリが2つ以上あるかのBoolean値
  const isTwoCategories =
    activeCategories.length - handleCheckCategoryName() >= 2;

  const navigate = useNavigate();
  // 登録ボタン押下時、DB(カテゴリマスタ)に値を保存する
  const onSend = async () => {
    try {
      const success = await updateCategories({
        localCategories,
        setActiveCategories,
        setCategoriesMaster,
      });

      if (success) {
        navigate("/user");
        setToast({
          show: true,
          message: "保存しました！",
          type: "",
        });
      }
    } catch (errorData) {
      handleApiError(errorData);
    }
  };

  return (
    <>
      <BasePage title="カテゴリーの変更">
        <p>６色のカテゴリー分けができます。</p>
        <div className="flex flex-col gap-2 tracking-normal items-center">
          <AttentionText>空欄にすると非表示になります。</AttentionText>
          <AttentionText>カテゴリーの変更は1ヶ月に1回までです。</AttentionText>
          <AttentionText>カテゴリーは2つ以上登録してください。</AttentionText>
          <AttentionText>
            すでに登録されたきろくには反映されません。
          </AttentionText>
        </div>
        <form action="" className="flex flex-col gap-4">
          {localCategories.map((cat, index) => {
            const bgColor = getSafeColor(cat.style.backgroundColor);
            const textColor = getSafeColor(cat.style.color);
            return (
              <fieldset
                key={cat.activeCatId || index}
                className="grid grid-cols-12 items-center p-4 pb-5 rounded-lg"
                style={{ background: bgColor }}
              >
                <label
                  htmlFor={`activeCategories-${index}`}
                  style={{ color: textColor }}
                  className="col-span-4"
                >
                  {cat.style.label}
                </label>
                <div className="col-span-8">
                  <TextField
                    type="text"
                    id={`activeCategories-${index}`}
                    value={cat.categoryName || ""}
                    onChange={(value) =>
                      handleInputChange(cat.activeCatId, value)
                    }
                    onBlur={handleCheckCategoryName}
                    placeholder="未登録"
                    maxLength="10"
                    minLength="0"
                    currentLength={(cat.categoryName || "").length}
                    count
                  />
                </div>
              </fieldset>
            );
          })}
        </form>
        {!isTwoCategories && (
          <p className="text-error-default">
            カテゴリーを2つ以上入力してください。
          </p>
        )}
        {!isEdit && (
          <p className="text-error-default">今月は変更できません。</p>
        )}
        <Button
          onClick={onSend}
          variant="primary"
          disabled={!isEdit || !isTwoCategories}
        >
          変更
        </Button>
      </BasePage>
    </>
  );
}

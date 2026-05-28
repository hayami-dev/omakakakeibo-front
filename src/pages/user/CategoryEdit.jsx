/* ユーザー毎のカテゴリの変更画面 */

import { useNavigate } from "react-router";
import { useAtom } from "jotai";
import {
  categoryService,
  activeCategoriesAtom,
  checkAlreadyEditCategory,
} from "@/service/categoryService";
import { getSafeColor } from "@/categoryColor";
import BasePage from "@/components/ui/BasePage";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import AlertCircleIcon from "@/assets/icons/AlertCircleIcon";

export default function CategoryEdit() {
  const [activeCategories, setActiveCategories] = useAtom(activeCategoriesAtom);

  //カテゴリの変更が可能かどうか
  const today = new Date();
  const isEdit = checkAlreadyEditCategory(today, activeCategories);

  // リアルタイムで変更を監視
  // 渡されたcat.activeCatId,e.target.valueをそれぞれ引数へ
  const handleInputChange = (id, newName) => {
    setActiveCategories((prev) =>
      prev.map((cat) =>
        cat.activeCatId === id ? { ...cat, categoryName: newName } : cat,
      ),
    );
  };

  const navigate = useNavigate();
  // 登録ボタン押下時、DB(カテゴリマスタ)に値を保存する
  const onSend = async () => {
    try {
      categoryService.saveCategories(activeCategories);
      navigate("/user");
    } catch (error) {
      console.error("カテゴリの保存に失敗しました…", error);
      alert("保存に失敗しました。もう一度試してください。");
    }
  };

  return (
    <>
      <BasePage title="カテゴリーの変更">
        <p>６色のカテゴリー分けができます。</p>
        <div className="flex flex-col gap-2  tracking-normal items-center">
          <p className="flex gap-2 text-text-cap text-xs w-fit">
            <span className="flex-shrink-0 mt-[-2px]">
              <AlertCircleIcon />
            </span>
            空欄にすると非表示になります。
          </p>
          <p className="flex gap-2 text-text-cap text-xs w-fit">
            <span className="flex-shrink-0 mt-[-2px]">
              <AlertCircleIcon />
            </span>
            すでに登録されたきろくには反映されません。
          </p>
          <p className="flex gap-2 text-text-cap text-xs w-fit">
            <span className="flex-shrink-0 mt-[-2px]">
              <AlertCircleIcon />
            </span>
            カテゴリの変更は1日1回までです。
          </p>
        </div>
        <form action="" onSubmit={onSend} className="flex flex-col gap-4">
          {activeCategories.map((cat, index) => {
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
                  {/* TODO：10文字を超えたら入力できなくするか赤くする */}
                  <TextField
                    type="text"
                    id={`activeCategories-${index}`}
                    value={cat.categoryName || ""}
                    onChange={(value) =>
                      handleInputChange(cat.activeCatId, value)
                    }
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
        <Button variant="primary" disabled={!isEdit}>
          変更
        </Button>
        {/* デバッグ用：開発中だけ表示する */}
        <button onClick={onSend}>(Debug)変更</button>{" "}
      </BasePage>
    </>
  );
}

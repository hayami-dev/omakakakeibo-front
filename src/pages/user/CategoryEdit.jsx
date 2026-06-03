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
import AttentionText from "@/components/ui/HelpText";

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
      await categoryService.saveCategories(activeCategories);
      alert("保存しました！");
      navigate("/user");
    } catch (errorData) {
      if (
        errorData.code === "ERR_MONTHLY_LIMIT" ||
        errorData.code === "ERR_MIN_CATEGORIES"
      ) {
        alert(errorData.message);
      } else {
        console.error("カテゴリの登録に失敗...", errorData);
        alert("予期せぬエラーが発生しました。");
      }
    }
  };

  return (
    <>
      <BasePage title="カテゴリーの変更">
        <p>６色のカテゴリー分けができます。</p>
        <div className="flex flex-col gap-2 tracking-normal items-center">
          <AttentionText>空欄にすると非表示になります。</AttentionText>
          <AttentionText>
            すでに登録されたきろくには反映されません。
          </AttentionText>
          <AttentionText>カテゴリの変更は1日1回までです。</AttentionText>
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

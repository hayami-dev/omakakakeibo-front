/* 選択可能なカテゴリの一覧 */

import { useMemo, useState, forwardRef, useImperativeHandle } from "react";
import { useAtomValue } from "jotai";
import {
  activeCategoriesAtom,
  categoriesMasterAtom,
  resolveCategoryById,
} from "@/service/categoryService";
import CategoryButton from "@/components/ui/CategoryButton";

const DisplayCategories = forwardRef(({ editItem, onErrorCheck }, ref) => {
  // カテゴリを取得
  const activeCategories = useAtomValue(activeCategoriesAtom);
  const categoriesMaster = useAtomValue(categoriesMasterAtom);

  // 表示するカテゴリ一覧をidをもとに作成
  const displayCategories = useMemo(() => {
    let list = [...activeCategories];

    // 編集時
    if (editItem?.categoryId) {
      // activeテーブルにmasterのどれが含まれているか
      const isActive = activeCategories.some(
        (cat) => cat.categoryId === editItem.categoryId,
      );

      if (!isActive) {
        const archivedTarget = resolveCategoryById(
          editItem.categoryId,
          categoriesMaster,
        );
        if (archivedTarget) {
          list.push(archivedTarget);
        }
      }
    }
    const displayList = list.map((cat) => ({
      ...cat,
      name: cat.categoryName,
      id: cat.categoryId,
    }));

    return displayList
      .filter((cat) => cat.name && cat.name.trim() !== "")
      .sort((a, b) => a.colorIndex - b.colorIndex);
  }, [activeCategories, categoriesMaster, editItem]);

  // 選択中のカテゴリの初期値を取得
  const [selectCategory, setSelectCategory] = useState(() => {
    const initial = editItem?.categoryId
      ? displayCategories.find((c) => c.id === editItem.categoryId) || ""
      : "";

    // 初期表示のタイミングで、親に今のステータスを即時通知
    // 編集で最初から入っていればエラーなし(false)、入っていなければエラー(true)
    if (onErrorCheck) {
      onErrorCheck(!initial);
    }
    return initial;
  });

  // クリックされたときに、State更新と同時に親へ通知するメソッド
  const handleSelect = (cat) => {
    setSelectCategory(cat);
    if (onErrorCheck) {
      onErrorCheck(false);
    }
  };

  // 親が取得する値を定義
  useImperativeHandle(ref, () => ({
    getValue: () => selectCategory,
    clearValue: () => setSelectCategory(""),
  }));

  return (
    <>
      <div className=" flex flex-col justify-center gap-4">
        {displayCategories.map((cat) => {
          const isSelected = selectCategory?.id === cat.id;
          return (
            <CategoryButton
              key={cat.id}
              catName={cat.name}
              catStyle={cat.style}
              isSelected={isSelected}
              onClick={() => handleSelect(cat)}
            />
          );
        })}
      </div>
      {!selectCategory && (
        <p className="text-center text-error-default pt-2 animate-pulse">
          カテゴリーを選択してください。
        </p>
      )}
    </>
  );
});

export default DisplayCategories;

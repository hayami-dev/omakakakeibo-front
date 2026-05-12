import { useAtomValue, useSetAtom } from "jotai";
import { NavLink } from "react-router";
import {
  activeCategoriesAtom,
  categoryService,
} from "../service/categoryService";
import { useEffect } from "react";

// ユーザー個別の情報の表示画面
export default function User() {
  // カテゴリ一覧を取得
  const setActiveCategories = useSetAtom(activeCategoriesAtom);
  const categories = useAtomValue(activeCategoriesAtom);

  useEffect(() => {
    const loadData = async () => {
      // JavaAPIを叩いて加工済みデータを取得
      // userId：1
      const data = await categoryService.fetchActiveCategories(1);

      // 取得したデータをAtomに保存
      setActiveCategories(data);
    };
    loadData();
  }, [setActiveCategories]); // 第2引数を空にすると初回のみ実行になる

  // 処理
  return (
    <>
      <NavLink to="/user/categoryEdit">📝 カテゴリー</NavLink>
      <NavLink to="/user/budgetEdit">💰 目標金額の変更</NavLink>
      {/* DBからアクティブカテゴリの取得 */}
      <ul>
        {categories.map((cat, index) => (
          <li key={cat.activeCatId || index} style={{ color: cat.style.code }}>
            {cat.categoryName}
          </li>
        ))}
      </ul>
    </>
  );
}

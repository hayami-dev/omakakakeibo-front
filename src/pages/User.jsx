import { useAtomValue } from "jotai";
import { NavLink } from "react-router";
import { activeCategoriesAtom } from "../service/categoryService";

// ユーザー個別の情報の表示画面
export default function User() {
  // カテゴリ一覧を取得
  const categories = useAtomValue(activeCategoriesAtom);

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

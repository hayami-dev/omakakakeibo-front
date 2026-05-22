/* ユーザー情報を表示する画面 */

import { useAtomValue } from "jotai";
import { NavLink } from "react-router";
import {
  activeCategoriesAtom,
  categoriesMasterAtom,
} from "../service/categoryService";

// ユーザー個別の情報の表示画面
export default function User() {
  // カテゴリ一覧を取得
  const activeCategories = useAtomValue(activeCategoriesAtom);
  const categoriesMaster = useAtomValue(categoriesMasterAtom);

  // 処理
  return (
    <>
      <NavLink to="/user/categoryEdit">📝 カテゴリー</NavLink>
      <NavLink to="/user/budgetEdit">💰 目標金額の変更</NavLink>
      {/* DBからアクティブカテゴリの取得 */}
      <ul>
        {activeCategories.map((cat, index) => (
          <li key={cat.activeCatId || index} style={{ color: cat.style.color }}>
            {cat.categoryName}
          </li>
        ))}
      </ul>
      {/* DBからカテゴリマスタの取得 */}
      <ul>
        {categoriesMaster
          .filter((cat) => !cat.isActive)
          .map((cat, index) => (
            <li
              key={cat.categoryId || index}
              style={{ color: cat.style.color }}
            >
              {cat.categoryName}
            </li>
          ))}
      </ul>
    </>
  );
}

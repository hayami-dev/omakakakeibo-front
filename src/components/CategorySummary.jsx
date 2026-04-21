import { useAtom } from "jotai";
import {
  activeCategoriesAtom,
  archivedCategoriesAtom,
  resolveCategoryById,
} from "../service/categoryService";

export default function CategorySummary({ history }) {
  const [activeCategories] = useAtom(activeCategoriesAtom);
  const [archivedCategories] = useAtom(archivedCategoriesAtom);

  // カテゴリid毎の金額の合計値を計算
  const categoryTotals = history.reduce(
    (acc, cur) => {
      const { categoryId, amount } = cur;
      // Mapの中にそのカテゴリがすでにあれば加算、なければ初期値から加算
      acc[categoryId] = (acc[categoryId] || 0) + amount;
      return acc;
    },
    {}, // 👈初期値
  );

  // 合計値にカテゴリ名、色情報を付与
  const summaryList = Object.entries(categoryTotals).map(
    ([categoryId, sum]) => {
      const category = resolveCategoryById(
        categoryId,
        activeCategories,
        archivedCategories,
      );
      return {
        id: categoryId,
        sum: sum,
        name: category?.name || "不明",
        color: category?.style?.code || "gray",
        colorIndex: category?.colorIndex ?? 999, // ソート用の重み
      };
    },
  );

  // 色順にソートする
  const sortedCategory = summaryList.sort(
    (a, b) => a.colorIndex - b.colorIndex,
  );

  return (
    <>
      <h3>カテゴリ毎の集計</h3>
      <ul>
        {sortedCategory.map((item) => {
          return (
            <li key={item.id}>
              <span style={{ color: item.color }}>●{item.name}</span>
              {item.sum.toLocaleString()}円
            </li>
          );
        })}
      </ul>
    </>
  );
}

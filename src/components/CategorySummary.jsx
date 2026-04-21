import { useAtom } from "jotai";
import {
  activeCategoriesAtom,
  archivedCategoriesAtom,
} from "../service/categoryService";
import { calcCategorySummary } from "../service/historyService";

export default function CategorySummary({ history }) {
  const [activeCategories] = useAtom(activeCategoriesAtom);
  const [archivedCategories] = useAtom(archivedCategoriesAtom);

  // カテゴリid毎の金額の合計値を計算
  const categoryTotals = calcCategorySummary(
    history,
    activeCategories,
    archivedCategories,
  );

  return (
    <>
      <h3>カテゴリ毎の集計</h3>
      <ul>
        {categoryTotals.map((item) => {
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

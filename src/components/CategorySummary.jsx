import { useAtom } from "jotai";
import {
  categoriesAtom,
  getCategoryDisplayInfo,
} from "../service/categoryService";

export default function CategorySummary({ history }) {
  // 最新マスタを参照
  const [categories] = useAtom(categoriesAtom);

  const categoryTotals = history.reduce(
    (acc, cur) => {
      const id = cur.category || "unknown";
      const amount = cur.amount || 0;
      // Mapの中にそのカテゴリがすでにあれば加算、なければ初期値から加算
      acc[id] = (acc[id] || 0) + amount;
      return acc;
    },
    {}, // 👈初期値
  );

  return (
    <>
      <h3>カテゴリ毎の集計</h3>
      <ul>
        {Object.entries(categoryTotals).map(([id, sum]) => {
          const cat = getCategoryDisplayInfo(categories, id);
          return (
            <li key={id}>
              <span style={{ color: cat.color }}>●</span>
              {cat.name}:{sum.toLocaleString()}円
            </li>
          );
        })}
      </ul>
    </>
  );
}

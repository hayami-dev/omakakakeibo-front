import { getCategoryNameById } from "../service/categoryService";

export default function CategorySummary({ history }) {
  const categoryTotals = history.reduce(
    (acc, cur) => {
      const id = cur.categoryId || cur.category || "unknown";
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
          return (
            <li key={id}>
              {getCategoryNameById(id)}:{sum.toLocaleString()}円
            </li>
          );
        })}
      </ul>
    </>
  );
}

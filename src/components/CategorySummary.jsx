export default function CategorySummary({ history }) {
  const categoryTotals = history.reduce(
    (acc, cur) => {
      const { categoryId, amount } = cur;
      // Mapの中にそのカテゴリがすでにあれば加算、なければ初期値から加算
      acc[categoryId] = (acc[categoryId] || 0) + amount;
      return acc;
    },
    {}, // 👈初期値
  );

  return (
    <>
      <h3>カテゴリ毎の集計</h3>
      <ul>
        {Object.entries(categoryTotals).map(([cat, sum]) => (
          <li key={cat}>
            {cat}:{sum.toLocaleString()}円
          </li>
        ))}
      </ul>
    </>
  );
}

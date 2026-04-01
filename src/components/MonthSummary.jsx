export default function MonthSummary({ history }) {
  const monthTotals = history.reduce((acc, cur) => {
    const month = cur.date.substring(0, 7);

    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += cur.amount;

    return acc;
  }, {});

  const sortedMonth = Object.entries(monthTotals).sort(
    // entriesで[][]状態
    (a, b) => b[0].localeCompare(a[0]), // 新しい月を上に(降順)
  );

  return (
    <section>
      <h3>月別の集計(降順)</h3>
      {sortedMonth.length === 0 ? (
        <p>データがありません</p>
      ) : (
        <ul>
          {sortedMonth.map(([month, total]) => (
            <li key={month}>
              <span>{month}</span>
              <span>{total.toLocaleString()}円</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

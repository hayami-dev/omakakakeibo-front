import { calcMonthSummary } from "../service/historyService";

export default function MonthSummary({ history }) {
  const monthTotals = calcMonthSummary(history);

  return (
    <section>
      <h3>月別の集計(あとでグラフになる)</h3>
      {monthTotals.length === 0 ? (
        <p>データがありません</p>
      ) : (
        <ul>
          {monthTotals.map(({ month, sum }) => (
            <li key={month}>
              <span>{month}：</span>
              <span>{sum.toLocaleString()}円</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

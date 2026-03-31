export default function MonthSummary({ history }) {
  const monthTotals = history.reduce((acc, cur) => {
    const month = cur.date.substring(0, 7);

    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += cur.amount;

    return acc;
  }, {});

//   const sortedMonth = Object.entries.reduce.sort((a, b) => a - b);
}

import { extractMonth, getYearMonth } from "../DateUtils";

export default function SelectMonth({ changeDisplayMonth }) {
  // 今月から6か月前までを取得
  function getLastSixMonths() {
    const months = [];
    for (let i = 0; i < 6; i++) {
      const formmaedDate = getYearMonth(0, -i);
      const yearMonth = formmaedDate.substring(0, 7);
      months.push(yearMonth);
    }
    return months.reverse();
  }
  const sixMonths = getLastSixMonths();

  return (
    <ul>
      {sixMonths.map((yearMonth) => {
        const displayMonth = extractMonth(yearMonth);
        return (
          <li key={yearMonth}>
            <button onClick={() => changeDisplayMonth(yearMonth)}>
              {displayMonth}月
            </button>
          </li>
        );
      })}
    </ul>
  );
}

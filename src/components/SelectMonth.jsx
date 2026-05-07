import { extractMonth, getRecentMonthsRange } from "../dateUtils";

export default function SelectMonth({ changeDisplayMonth }) {
  const sixMonths = getRecentMonthsRange();

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

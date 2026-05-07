import { extractMonth } from "../dateUtils";

export default function SelectMonth({ changeDisplayMonth, targetMonth }) {
  return (
    <ul>
      {targetMonth.map((yearMonth) => {
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

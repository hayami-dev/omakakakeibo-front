import { AiFillCloseCircle } from "react-icons/ai";

export default function HistoryList({ history, onRemove }) {
  return (
    <>
      <h2>りれき</h2>
      <ul>
        {history.map((item, index) => (
          <li key={index}>
            【{item.category}】{item.amount.toLocaleString("ja-JP")}円
            <AiFillCloseCircle onClick={() => onRemove(index)} />
          </li>
        ))}
      </ul>
    </>
  );
}

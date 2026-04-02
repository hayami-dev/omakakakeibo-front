import { AiFillEdit } from "react-icons/ai";

export default function HistoryList({ history, onEdit }) {
  return (
    <>
      <h2>りれき</h2>
      <ul>
        {history.map((item, index) => (
          <li key={index}>
            <time dateTime={item.date}>
              {item.date.toString().replaceAll("-", "/")}
            </time>
            【{item.category}】{item.amount.toLocaleString("ja-JP")}円
            <AiFillEdit onClick={() => onEdit(index)} />
          </li>
        ))}
      </ul>
    </>
  );
}

import { AiFillEdit } from "react-icons/ai";
import { getCategoryNameById } from "../service/categoryService";

export default function HistoryList({ history, onEdit }) {
  return (
    <>
      <h2>りれき</h2>
      <ul>
        {history.map((item) => (
          <li key={item.id}>
            <time dateTime={item.date}>
              {item.date.toString().replaceAll("-", "/")}
            </time>
            【{getCategoryNameById(item.category)}】
            {item.amount.toLocaleString("ja-JP")}円
            <AiFillEdit onClick={() => onEdit(item.id)} />
          </li>
        ))}
      </ul>
    </>
  );
}

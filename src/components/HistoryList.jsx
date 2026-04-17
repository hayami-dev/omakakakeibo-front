import { AiFillEdit } from "react-icons/ai";

export default function HistoryList({ history, onEdit }) {
  return (
    <>
      <h2>りれき</h2>
      <ul>
        {history.map((item, index) => {
          // console.table(item);
          // console.log("History item.category", item.category);
          // console.log("History  item.id", item.id);
          // console.log(
          //   // 🔥これは今はない
          //   "History item.category.name",
          //   item.category.name ? item.category.name : null,
          // );
          return (
            <li key={item.id}>
              <time dateTime={item.date}>
                {item.date.toString().replaceAll("-", "/")}
              </time>
              【{item.category?.name || item.category}】
              {item.amount.toLocaleString("ja-JP")}円
              <AiFillEdit onClick={() => onEdit(index)} />
            </li>
          );
        })}
      </ul>
    </>
  );
}

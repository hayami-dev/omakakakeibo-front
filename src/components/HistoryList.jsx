import { AiFillEdit } from "react-icons/ai";
import {
  categoriesAtom,
  getCategoryDisplayInfo,
} from "../service/categoryService";
import { useAtom } from "jotai";

export default function HistoryList({ history, onEdit }) {
  // 最新マスタを参照
  const [categories] = useAtom(categoriesAtom);
  return (
    <>
      <h2>りれき</h2>
      <ul>
        {history.map((item) => {
          const cat = getCategoryDisplayInfo(categories, item.category);
          return (
            <li key={item.id}>
              <time dateTime={item.date}>
                {item.date.toString().replaceAll("-", "/")}
              </time>
              【
              <span
                style={{
                  color: cat.color,
                }}
              >
                ●
              </span>
              {cat.name}】{item.amount.toLocaleString("ja-JP")}円
              <AiFillEdit onClick={() => onEdit(item.id)} />
            </li>
          );
        })}
      </ul>
    </>
  );
}

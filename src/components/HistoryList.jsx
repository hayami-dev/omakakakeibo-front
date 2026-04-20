import { AiFillEdit } from "react-icons/ai";
import {
  activeCategoriesAtom,
  archivedCategoriesAtom,
  resolveCategoryById,
} from "../service/categoryService";
import { useAtom } from "jotai";

export default function HistoryList({ history, onEdit }) {
  // activeとarchiveのカテゴリを取得
  const [activeCategories] = useAtom(activeCategoriesAtom);
  const [archivedCategories] = useAtom(archivedCategoriesAtom);
  return (
    <>
      <h2>りれき</h2>
      <ul>
        {history.map((item, index) => {
          const categoryName = resolveCategoryById(
            item.category,
            activeCategories,
            archivedCategories,
          );
          return (
            <li key={item.id}>
              <time dateTime={item.date}>
                {item.date.toString().replaceAll("-", "/")}
              </time>
              【{categoryName.name}】{item.amount.toLocaleString("ja-JP")}円
              <AiFillEdit onClick={() => onEdit(index)} />
            </li>
          );
        })}
      </ul>
    </>
  );
}

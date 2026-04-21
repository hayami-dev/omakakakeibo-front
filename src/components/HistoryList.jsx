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

  // 日付を昇順にソート
  const dateSortHistory = [...history].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );
  return (
    <>
      <h2>りれき</h2>
      <ul>
        {dateSortHistory.map((item) => {
          const category = resolveCategoryById(
            item.categoryId,
            activeCategories,
            archivedCategories,
          );
          return (
            <li key={item.id}>
              <time dateTime={item.date}>
                {item.date.toString().replaceAll("-", "/")}
              </time>
              <span
                style={{
                  color: category?.style?.code,
                }}
              >
                ●{category?.name || "不明なカテゴリ"}
              </span>
              {item.amount.toLocaleString("ja-JP")}円
              <AiFillEdit onClick={() => onEdit(item.id)} />
            </li>
          );
        })}
      </ul>
    </>
  );
}

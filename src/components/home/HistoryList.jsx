import { AiFillEdit } from "react-icons/ai";
import {
  categoriesMasterAtom,
  resolveCategoryById,
} from "../../service/categoryService";
import { useAtom } from "jotai";

export default function HistoryList({ history, onEdit }) {
  // カテゴリを全件取得
  const [masterCategories] = useAtom(categoriesMasterAtom);

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
            masterCategories,
          );
          return (
            <li key={item.historyId}>
              <time dateTime={item.historyDate}>
                {item.historyDate.toString().replaceAll("-", "/")}
              </time>
              <span
                style={{
                  color: category?.style?.color,
                }}
              >
                ●{category?.categoryName || "不明なカテゴリ"}
              </span>
              {item.amount.toLocaleString()}円
              <AiFillEdit onClick={() => onEdit(item.historyId)} />
            </li>
          );
        })}
      </ul>
    </>
  );
}

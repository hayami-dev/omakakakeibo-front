/* ひと月に記録された支出の一覧 */

import { useAtomValue } from "jotai";
import { AiFillEdit } from "react-icons/ai";
import { useNavigate } from "react-router";
// service
import {
  categoriesMasterAtom,
  resolveCategoryById,
} from "../../service/categoryService";
import {
  historiesAtom,
  filterHistoryByMonths,
  currentMonthAtom,
} from "../../service/historyService";

export default function HistoryList() {
  // 支出の履歴を取得
  const histories = useAtomValue(historiesAtom);

  // 選択中の月を取得
  const currentMonth = useAtomValue(currentMonthAtom);

  // カテゴリを全件取得
  const masterCategories = useAtomValue(categoriesMasterAtom);

  // 各月の全履歴へ加工
  const filterHistories = filterHistoryByMonths(histories, currentMonth);

  // 日付を昇順にソート
  const dateSortHistory = filterHistories.sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  const navigate = useNavigate();
  const onEdit = (targetId) => {
    const targetHistoryItem = histories.find(
      (item) => item.historyId === targetId,
    );

    navigate("/input", {
      state: { item: targetHistoryItem },
    });
  };
  return (
    <>
      <h2>りれき</h2>
      <ul>
        {dateSortHistory?.map((item) => {
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

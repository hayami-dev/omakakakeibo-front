/* ひと月に記録された支出の一覧 */

import { useAtomValue } from "jotai";
import { AiFillEdit } from "react-icons/ai";
import { useNavigate } from "react-router";
// service
import {
  categoriesMasterAtom,
  resolveCategoryById,
} from "@/service/categoryService";
import {
  historiesAtom,
  filterHistoryByMonths,
  currentMonthAtom,
} from "@/service/historyService";
// utils
import { extractMonthAndDay } from "@/dateUtils";
// components・assets
import CategoryDisplay from "@/components/ui/CategoryDisplay";
import EditIcon from "@/assets/icons/EditIcon";

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
  const dateSortHistory = [...filterHistories].sort(
    (a, b) => new Date(a.historyDate) - new Date(b.historyDate),
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
    <ul className="flex flex-col gap-2 px-space-400">
      {dateSortHistory?.map((item) => {
        const category = resolveCategoryById(item.categoryId, masterCategories);
        return (
          <li key={item.historyId} className="grid grid-cols-12 items-center">
            <time
              dateTime={item.historyDate}
              className="col-span-2 text-sm text-text-cap text-center"
            >
              {item.historyDate
                ? extractMonthAndDay(item.historyDate)
                : "日付なし"}
            </time>
            <div className="col-span-5 text-xl text-right pr-space-400">
              <span>{item?.amount?.toLocaleString() ?? "0"}</span>
              <span className="text-base pl-[0.25rem]">円</span>
            </div>
            <div className="col-span-4 text-sm">
              <CategoryDisplay
                colorVar={category?.style?.color}
                catName={category?.categoryName}
              />
            </div>
            <div className="text-center col-span-1">
              <button
                onClick={() => onEdit(item.historyId)}
                className="text-main-default w-[20px]"
              >
                <EditIcon />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

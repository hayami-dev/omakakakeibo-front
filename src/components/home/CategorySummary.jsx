/* ひと月に記録された各カテゴリの合計値を円グラフで表示 */

import { useAtomValue } from "jotai";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { categoriesMasterAtom } from "@/service/categoryService";
import {
  historiesAtom,
  currentMonthAtom,
  calcCategorySummary,
  filterHistoryByMonths,
} from "@/service/historyService";
import { getSafeColor } from "@/categoryColor";
import CategoryDisplay from "@/components/ui/CategoryDisplay";

// Pieグラフには ArcElement（扇形）が必要
ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategorySummary() {
  // 支出の履歴を取得
  const histories = useAtomValue(historiesAtom);

  // 選択中の月を取得
  const currentMonth = useAtomValue(currentMonthAtom);

  // カテゴリマスタを取得
  const categoriesMaster = useAtomValue(categoriesMasterAtom);

  // historiesを月毎にフィルター
  const filterHistories = filterHistoryByMonths(histories, currentMonth);

  // カテゴリid毎の金額の合計値を計算
  const categoryTotals = calcCategorySummary(
    filterHistories,
    categoriesMaster,
  ).sort((a, b) => {
    if (a.isActive !== b.isActive) {
      return b.isActive - a.isActive;
    }
    return a.colorIndex - b.colorIndex;
  });

  // データがあるかどうかの判定
  const hasData =
    categoryTotals.length > 0 && categoryTotals.some((item) => item.sum > 0);

  const graphOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,
    events: [],
    animation: false, // アニメーションをオフ
    animations: false, // 全ての個別アニメーションをオフ
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: hasData,
      },
    },
  };

  const chartData = {
    labels: hasData ? categoryTotals?.map((item) => item.name) : ["データなし"],
    datasets: [
      {
        data: hasData ? categoryTotals?.map((item) => item.sum) : [1],
        backgroundColor: hasData
          ? categoryTotals?.map((item) => getSafeColor(item.color))
          : ["#ccc"],
        borderWidth: false,
        cutout: "30%",
      },
    ],
  };

  return (
    <div className="grid grid-cols-12 items-center">
      <div className="col-span-6 aspect-square mx-space-400">
        <div className="w-full aspect-square relative">
          <Doughnut data={chartData} options={graphOptions}></Doughnut>
        </div>
      </div>
      <div className="col-span-6">
        <ul className="h-full flex flex-col gap-1 justify-center">
          {filterHistories.length === 0 && (
            <li className="text-xs text-muted/70 py-1 pl-2 list-none text-disabled-default">
              <span className="text-[#ccc]">● </span>データなし
            </li>
          )}
          {categoryTotals?.map((item) => {
            return (
              <li key={item.id} className="text-sm grid grid-cols-12">
                <CategoryDisplay colorVar={item.color} catName={item.name} />
                <span className="col-span-1">：</span>
                <span className="col-span-5 break-all">
                  {item.sum.toLocaleString()}円
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

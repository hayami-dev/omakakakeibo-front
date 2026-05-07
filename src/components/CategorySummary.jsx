import { useAtom } from "jotai";
import {
  activeCategoriesAtom,
  archivedCategoriesAtom,
} from "../service/categoryService";
import { calcCategorySummary } from "../service/historyService";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

// Pieグラフには ArcElement（扇形）が必要
ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategorySummary({ history }) {
  const [activeCategories] = useAtom(activeCategoriesAtom);
  const [archivedCategories] = useAtom(archivedCategoriesAtom);

  // カテゴリid毎の金額の合計値を計算
  const categoryTotals = calcCategorySummary(
    history,
    activeCategories,
    archivedCategories,
  );

  // データがあるかどうかの判定
  const hasData =
    categoryTotals.length > 0 && categoryTotals.some((item) => item.sum > 0);

  const graphOptions = {
    responsive: true,
    // maintainAspectRatio: false, // TODO:cssの設定が効くようにする
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
    labels: hasData ? categoryTotals.map((item) => item.name) : ["データなし"],
    datasets: [
      {
        data: hasData ? categoryTotals.map((item) => item.sum) : [1],
        backgroundColor: hasData
          ? categoryTotals.map((item) => item.color)
          : ["gray"],
        borderWidth: false,
      },
    ],
  };

  return (
    <>
      <h3>カテゴリ毎の集計</h3>
      <Pie data={chartData} options={graphOptions}></Pie>
      <ul>
        {categoryTotals.map((item) => {
          return (
            <li key={item.id}>
              <span style={{ color: item.color }}>●{item.name}</span>
              {item.sum.toLocaleString()}円
            </li>
          );
        })}
      </ul>
    </>
  );
}

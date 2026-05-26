/* 6ヶ月間の支出の棒グラフを表示 */

import { useAtomValue } from "jotai";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  calcMonthSummary,
  currentMonthAtom,
  historiesAtom,
} from "@/service/historyService";
import { monthlyBudgetAtom } from "@/service/budgetService";
import { getRecentMonthsRange } from "@/dateUtils";
import SelectMonth from "@/components/home/SelectMonth";
import BudgetArrow from "@/assets/icons/budget-arrow.svg";
import { isClient, computedStyle } from "@/categoryColor";

ChartJS.register(CategoryScale, LinearScale, BarElement);

export default function MonthSummary() {
  // 支出の履歴を取得
  const histories = useAtomValue(historiesAtom);

  // 目標金額を取得
  const monthlyBudget = useAtomValue(monthlyBudgetAtom);

  // 選択中の月を取得
  const currentMonth = useAtomValue(currentMonthAtom);

  // 今日から6ヶ月間を取得
  const activeMonthList = getRecentMonthsRange();

  // 全ての各月の合計値を計算
  const totalMap = calcMonthSummary(histories) || [];

  // 各月の合計値を返す
  const monthTotals = activeMonthList.map((month) => ({
    month: month,
    sum: totalMap[month] || 0,
  }));

  // 選択中の月のインデックス
  const activeMonthBar = monthTotals.findIndex(
    (item) => item.month === currentMonth,
  );

  // 月の前半か後半かを区別
  const isStart = activeMonthBar <= activeMonthList.length / 2 - 1;

  // budgetAmountの左右位置を計算
  const leftPosition = 54 * (activeMonthBar + 1);
  const rightPosition = 54 * (activeMonthList.length - 1 - activeMonthBar + 1);

  /* グラフ */

  // グラフの下線
  const borderColor = isClient
    ? computedStyle.getPropertyValue("--color-border").trim()
    : "#E2E8F0";

  // グラフの超過分
  const colorMainDefault = isClient
    ? computedStyle.getPropertyValue("--color-main-default").trim()
    : "#f2542d";
  // 目標内
  const colorMainSoft = isClient
    ? computedStyle.getPropertyValue("--color-main-soft").trim()
    : "#f57d5f";
  // 目標内、超過分の区切り線
  const colorMainBg = isClient
    ? computedStyle.getPropertyValue("--color-main-bg").trim()
    : "#feefec";

  // グラフの設定
  const graphOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false, // アニメーションをオフ
    animations: false, // 全ての個別アニメーションをオフ
    events: [], // ホバー等のイベントも不要ならオフ
    scales: {
      y: {
        stacked: true,
        beginAtZero: true,
        max: monthlyBudget * 1.5,
        display: false,
      },
      x: {
        stacked: true,
        display: true,
        grid: { display: false },
        border: { display: true, color: borderColor, width: 2 },
        ticks: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const chartData = {
    labels: monthTotals.map(() => ""),
    datasets: [
      {
        label: "目標内",
        data: monthTotals.map((item) => {
          if (item.sum === 0) return 0;

          const baseValue = Math.min(item.sum, monthlyBudget);
          return Math.max(
            monthlyBudget * 0.02,
            baseValue - monthlyBudget * 0.01,
          );
        }),
        backgroundColor: monthTotals.map((_, index) =>
          index === activeMonthBar
            ? `${colorMainSoft}FF`
            : `${colorMainSoft}66`,
        ),
        stack: "stack",
      },
      {
        label: "境界線",
        data: monthTotals.map((item) =>
          item.sum >= monthlyBudget ? monthlyBudget * 0.02 : 0,
        ),
        backgroundColor: monthTotals.map((_, index) =>
          index === activeMonthBar ? `${colorMainBg}FF` : `${colorMainBg}66`,
        ),
        stack: "stack",
      },
      {
        label: "超過分",
        data: monthTotals.map((item) => Math.max(0, item.sum - monthlyBudget)),
        backgroundColor: monthTotals.map((_, index) =>
          index === activeMonthBar
            ? `${colorMainDefault}FF`
            : `${colorMainDefault}66`,
        ),
        stack: "stack",
      },
    ],
  };

  return (
    <section className="px-space-400">
      <div className="h-[120px] relative">
        <Bar options={graphOptions} data={chartData} />
        <div
          className="flex items-center gap-1 text-text-cap text-sm absolute top-[22%]"
          style={
            isStart
              ? { left: `${leftPosition}px` }
              : { right: `${rightPosition}px` }
          }
        >
          {isStart && <img src={BudgetArrow} alt="" className="rotate-180" />}
          {monthlyBudget?.toLocaleString()}
          <span>円</span>
          {!isStart && <img src={BudgetArrow} alt="" />}
        </div>
      </div>
      {/* 月ラベルの表示ロジック */}
      <SelectMonth />
    </section>
  );
}

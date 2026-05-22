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
        max: monthlyBudget * 2,
        display: false,
      },
      x: {
        stacked: true,
        display: false,
        grid: { display: false },
        border: { display: true, color: "#c5c5c5", width: 2 },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // TODO：カラーコードをCSS変数で管理
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
          index === activeMonthBar ? "#F57D5FFF" : "#F57D5F66",
        ),
        stack: "stack",
      },
      {
        label: "境界線",
        data: monthTotals.map((item) =>
          item.sum >= monthlyBudget ? monthlyBudget * 0.02 : 0,
        ),
        backgroundColor: monthTotals.map((_, index) =>
          index === activeMonthBar ? "#FEEFECFF" : "#FEEFEC66",
        ),
        stack: "stack",
      },
      {
        label: "超過分",
        data: monthTotals.map((item) => Math.max(0, item.sum - monthlyBudget)),
        backgroundColor: monthTotals.map((_, index) =>
          index === activeMonthBar ? "#F2542DFF" : "#F2542D66",
        ),
        stack: "stack",
      },
    ],
  };

  return (
    <section>
      <h3>月別の集計</h3>
      <div style={{ height: "300px", position: "relative", padding: "0 48px" }}>
        <Bar options={graphOptions} data={chartData} />
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "0",
            transform: "translateY(-50%)",
          }}
        >
          {monthlyBudget}円 ▶
        </span>
        {/* 月ラベルの表示ロジック */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          {monthTotals.map((item) => {
            const [year, month] = item.month.split("-");
            const isJanOrDec = month === "12" || month === "01";
            return (
              <div
                key={item.month}
                style={{ textAlign: "center", fontSize: "12px" }}
              >
                {isJanOrDec && (
                  <p style={{ margin: 0, color: "#888" }}>{year}年</p>
                )}
                <p
                  style={{
                    margin: 0,
                    fontWeight: item.month === currentMonth ? "bold" : "normal",
                  }}
                >
                  {parseInt(month, 10)}月
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

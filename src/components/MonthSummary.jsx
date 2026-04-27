import {
  Chart as ChartJS,
  CategoryScale, // X軸用
  LinearScale, // Y軸用
  BarElement, // 棒グラフ本体
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { calcMonthSummary } from "../service/historyService";

// Chart.jsの機能を登録
ChartJS.register(CategoryScale, LinearScale, BarElement);

export default function MonthSummary({ history, monthlyBudget }) {
  const monthTotals = calcMonthSummary(history) || [];

  // 目標金額と超過分を区切る線の太さ
  const lineWidth = monthlyBudget * 0.02;
  // 目標金額内の合計値
  const budgetData = monthTotals.map((item) =>
    Math.min(item.sum, monthlyBudget - lineWidth),
  );
  // 境界線用
  const borderLineData = monthTotals.map((item) =>
    item.sum >= monthlyBudget ? lineWidth : 0,
  );
  // 超過分の合計値
  const overData = monthTotals.map((item) =>
    Math.max(0, item.sum - monthlyBudget),
  );

  // Chart.jsの設定
  const graphOptions = {
    responsive: true,
    scales: {
      y: {
        stacked: true, // 積み上げを可能に
        beginAtZero: true, // Y軸を0から始める
        max: monthlyBudget * 2,
        display: false,
        ticks: {
          display: false,
        },
        grid: {
          display: false, // 背景の縦線を非表示
        },
      },
      x: {
        stacked: true, // 積み上げを可能に
        grid: {
          display: false, // 背景の縦線を非表示
        },
        // グラフの下につける線
        border: {
          display: true,
          color: "#c5c5c5",
          width: 2,
        },
      },
    },
  };
  const chartData = {
    // データの数だけ空文字を入れる
    labels: monthTotals.map(() => ""),
    datasets: [
      {
        label: "目標内",
        data: budgetData,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        stack: "stack",
      },
      {
        label: "境界線",
        data: borderLineData,
        backgroundColor: "rgba(226, 226, 226, 0.8)",
        stack: "stack",
      },
      {
        label: "超過分",
        data: overData,
        backgroundColor: "rgba(255, 99, 132, 0.8)",
        stack: "stack",
      },
    ],
  };

  return (
    <section>
      <h3>月別の集計(あとでグラフになる)</h3>
      {monthTotals.length === 0 ? (
        <p>データがありません</p>
      ) : (
        <ul>
          {monthTotals.map(({ month, sum }) => (
            <li key={month}>
              <span>{month}：</span>
              <span>{sum.toLocaleString()}円</span>
            </li>
          ))}
        </ul>
      )}
      <div>
        <Bar options={graphOptions} data={chartData} />
        <span>{monthlyBudget}円 ▶</span>
        {monthTotals.map((item) => {
          const [year, month] = item.month.split("-");
          const monthNum = parseInt(month, 10);
          return (
            <div key={item.month}>
              {(month === "12" || month === "01") && (
                <p>
                  {year}
                  <span>年</span>
                </p>
              )}
              <p>
                {monthNum}
                <span>月</span>
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

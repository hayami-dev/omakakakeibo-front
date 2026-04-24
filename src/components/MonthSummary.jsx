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
  const labels = monthTotals.map((item) => item.month);
  const dataValues = monthTotals.map((item) => item.sum);

  // Chart.jsの設定
  const graphOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true, // Y軸を0から始める
        ticks: {
          callback: (value) => value.toLocaleString() + "円", // 単位をつける
          stepSize: monthlyBudget,
          maxTicksLimit: 3,
        },
        grid: {
          display: false, // 背景の縦線を非表示
        },
      },
      x: {
        grid: {
          display: false, // 背景の縦線を非表示
        },
      },
    },
  };
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "支出額",
        data: dataValues,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
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
      </div>
    </section>
  );
}

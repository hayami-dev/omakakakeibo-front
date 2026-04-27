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
  const dataValues = monthTotals.map((item) => item.sum);

  // Chart.jsの設定
  const graphOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true, // Y軸を0から始める
        max: monthlyBudget * 2,
        ticks: {
          // 目標金額だけ表示させる
          callback: function (value) {
            if (value === monthlyBudget) {
              return value.toLocaleString() + "円";
            }
          },
          stepSize: monthlyBudget,
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
    // データの数だけ空文字を入れる
    labels: monthTotals.map(() => ""),
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

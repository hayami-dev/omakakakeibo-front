import {
  Chart as ChartJS,
  CategoryScale, // X軸用
  LinearScale, // Y軸用
  BarElement, // 棒グラフ本体
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { calcMonthSummary } from "../service/historyService";
import { useState, useEffect } from "react";

// Chart.jsの機能を登録
ChartJS.register(CategoryScale, LinearScale, BarElement);

export default function MonthSummary({ history, monthlyBudget, selectMonth }) {
  const monthTotals = calcMonthSummary(history) || [];

  // 💡 最初はすべてのデータを「0」で初期化しておく
  const [chartDataValues, setChartDataValues] = useState({
    budget: monthTotals.map(() => 0),
    over: monthTotals.map(() => 0),
    border: monthTotals.map(() => 0),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setChartDataValues({
        budget: monthTotals.map((item) =>
          Math.max(0, Math.min(item.sum, monthlyBudget) - monthlyBudget * 0.01),
        ),
        border: monthTotals.map((item) =>
          item.sum >= monthlyBudget ? monthlyBudget * 0.02 : 0,
        ),
        over: monthTotals.map((item) => Math.max(0, item.sum - monthlyBudget)),
      });
    }, 50);

    return () => clearTimeout(timer); // 💡 コンポーネント破棄時にタイマーを掃除（Javaのメモリリーク対策と同じ）
  }, [history, monthlyBudget]);

  // 選択中の月を取得
  const activeMonthBar = monthTotals.findIndex(
    (item) => item.month === selectMonth,
  );
  console.log(activeMonthBar);

  // Chart.jsの設定
  const graphOptions = {
    responsive: true,
    hover: {
      mode: null,
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
    animations: {
      y: {
        type: "number",
        duration: 1000,
        loop: false,
      },
      colors: {
        type: "color",
        duration: 0, // 月を切り替えた時は即座に変化
      },
    },
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
        data: chartDataValues.budget,
        backgroundColor: monthTotals.map((_, index) =>
          index === activeMonthBar ? "#F57D5FFF" : "#F57D5F66",
        ),
        stack: "stack",
      },
      {
        label: "境界線",
        data: chartDataValues.border,
        backgroundColor: monthTotals.map((_, index) =>
          index === activeMonthBar ? "#FEEFECFF" : "#FEEFEC66",
        ),
        stack: "stack",
      },
      {
        label: "超過分",
        data: chartDataValues.over,
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
      {/* {monthTotals.length === 0 ? (
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
      )} */}
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

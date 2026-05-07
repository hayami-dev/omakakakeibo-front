import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { calcMonthSummary } from "../service/historyService";

ChartJS.register(CategoryScale, LinearScale, BarElement);

export default function MonthSummary({
  history,
  monthlyBudget,
  selectMonth,
  targetMonth,
}) {
  const totalMap = calcMonthSummary(history) || [];

  const monthTotals = targetMonth.map((month) => ({
    month: month,
    sum: totalMap[month] || 0,
  }));

  // 選択中の月のインデックス
  const activeMonthBar = monthTotals.findIndex(
    (item) => item.month === selectMonth,
  );

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

  const chartData = {
    labels: monthTotals.map(() => ""),
    datasets: [
      {
        label: "目標内",
        data: monthTotals.map((item) =>
          Math.max(0, Math.min(item.sum, monthlyBudget) - monthlyBudget * 0.01),
        ),
        backgroundColor: monthTotals.map((_, index) =>
          index === activeMonthBar ? "#F57D5FFF" : "#F57D5F66",
        ),
        stack: "stack",
        minBarLength: 3,
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
                    fontWeight: item.month === selectMonth ? "bold" : "normal",
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

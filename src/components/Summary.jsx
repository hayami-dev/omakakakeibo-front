/* 月毎の合計金額、縦線グラフを表示する */

export default function Summary({ total, selectMonth }) {
  return (
    <p>
      {selectMonth}月の合計：
      <strong>{total.toLocaleString("ja-JP")}円</strong>
    </p>
  );
}

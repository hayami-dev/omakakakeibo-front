/* 月毎の合計金額、縦線グラフを表示する */

export default function Summary({ total }) {
  return (
    <p>
      合計：
      <strong>{total.toLocaleString("ja-JP")}円</strong>
    </p>
  );
}

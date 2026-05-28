/* Homeに表示するカテゴリ */

import { getSafeColor } from "@/categoryColor";

export default function CategoryDisplay({ colorVar, catName }) {
  // css変数を変換
  const catColor = getSafeColor(colorVar);
  return (
    <>
      <div
        style={{ color: catColor }}
        className="col-span-6 flex gap-1 tracking-normal"
      >
        <span>●</span>
        <span className="break-all">{catName}</span>
      </div>
    </>
  );
}

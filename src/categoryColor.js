// index.cssの変数名とラベルを紐付けるマスター
export const COLOR_MAP = [
  { label: "グリーン", id: 0 },
  { label: "イエロー", id: 1 },
  { label: "レッド", id: 2 },
  { label: "ピンク", id: 3 },
  { label: "パープル", id: 4 },
  { label: "ブルー", id: 5 },
  { label: "未設定", id: 6 },
];

/**
 * 受け取ったcolorIndexを元に、CSS変数を含んだスタイルオブジェクトを返す
 */
export const getCategoryColorSet = (index) => {
  // 範囲外のインデックスが来たら 0番（グレー）をデフォルトにする
  const config = COLOR_MAP[index] || COLOR_MAP[6];

  return {
    label: config.label,
    color: `var(--cat-color-${index})`,
    backgroundColor: `var(--cat-bg-${index})`,
    disabledColor: `var(--cat-disabled-${index})`,
  };
};

/* index.cssの変数名とラベルを紐付けるマスター */

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
    color: `var(--color-cat-color-${index})`,
    backgroundColor: `var(--color-cat-bg-${index})`,
    disabledColor: `var(--color-cat-disabled-${index})`,
  };
};

// カラー変数をグラフに利用するための設定
export const isClient = typeof window !== "undefined";
export const computedStyle = isClient ? getComputedStyle(document.body) : null;

/**
 * Chart.jsでCSS変数が読まれない時用
 */
export const catColors = {
  color: [
    "#44af69", // 0: グリーン
    "#f8be10", // 1: イエロー
    "#f22c22", // 2: レッド
    "#e66bc7", // 3: ピンク
    "#9747ff", // 4: パープル
    "#0d99ff", // 5: ブルー
    "#5a5a5a", // 6: グレー
  ],
  bg: [
    "#eff8f2", // 0
    "#fef9ea", // 1
    "#feeceb", // 2
    "#fdf1fa", // 3
    "#f6eeff", // 4
    "#e9f6ff", // 5
    "#c5c5c5", // 6
  ],
  disabled: [
    "#476a54", // 0
    "#867035", // 1
    "#833c38", // 2
    "#8e4b7d", // 3
    "#633a99", // 4
    "#316285", // 5
    "#5a5a5a", // 6
  ],
};

/**
 * 呼び出し側から送られてくる 'var(--color-cat-color-1)' などの文字列から
 * 番号だけを自動でピックして、上の直書き配列から個別に色を返す
 */
export const getSafeColor = (varName) => {
  if (!varName) return "#ccc";

  // 文字列から含まれる数字（0〜6）を自動抽出
  const match = varName.match(/\d+/);
  if (!match) return "#ccc";

  const index = parseInt(match[0], 10);

  if (varName.includes("bg")) return catColors.bg[index] || "#ccc";
  if (varName.includes("disabled")) return catColors.disabled[index] || "#ccc";
  return catColors.color[index] || "#ccc";
};

/* 日付のフォーマットに関するメソッド群 */

// yyyy-MM-dd
// InputFormでの入力に使用
export const getFormattedDate = (
  yearOffset = 0,
  monthOffset = 0,
  dayOffset = 0,
) => {
  const date = new Date(); // 今日を取得

  // 日付は直で日付を入力
  if (dayOffset !== 0) date.setDate(dayOffset);

  if (yearOffset !== 0) date.setFullYear(date.getFullYear() + yearOffset);
  if (monthOffset !== 0) date.setMonth(date.getMonth() + monthOffset);

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .replaceAll("/", "-");
};
// yyyy-MM
// 月毎のSummaryに使用
export const getYearMonth = (yearOffset = 0, monthOffset = 0) => {
  const fullDate = getFormattedDate(yearOffset, monthOffset, 1);
  return fullDate.substring(0, 7);
};

// yyyyに加工
export function extractYear(yearMonthStr) {
  if (!yearMonthStr) {
    return "";
  }
  return parseInt(yearMonthStr.substring(0, 4));
}

// MMに加工
export function extractMonth(yearMonthStr) {
  if (!yearMonthStr) {
    return "";
  }
  return parseInt(yearMonthStr.substring(5, 7));
}

// MM/ddに加工
export function extractMonthAndDay(date) {
  if (!date) return "";
  return date.substring(5, 10).replaceAll("-", "/");
}

// 今月から6か月前までを取得
export function getRecentMonthsRange(count = 6) {
  const months = [];
  for (let i = 0; i < count; i++) {
    const formattedDate = getYearMonth(0, -i);
    const yearMonth = formattedDate.substring(0, 7);
    months.push(yearMonth);
  }
  return months.reverse();
}

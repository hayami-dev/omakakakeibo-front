// yyyy-MM-dd
// InputFormでの入力に使用
export const getFormattedDate = (
  yearOffset = 0,
  monthOffset = 0,
  dayOffset = 0,
) => {
  const date = new Date(); // 今日を取得

  if (yearOffset !== 0) date.setFullYear(date.getFullYear() + yearOffset);
  if (monthOffset !== 0) date.setMonth(date.getMonth() + monthOffset);

  // 日付は直で入力
  if (dayOffset !== 0) date.setDate(date.getDate(dayOffset));

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

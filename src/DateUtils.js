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

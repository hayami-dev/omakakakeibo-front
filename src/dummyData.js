export const getDummyData = [
  // 🎒 2026年4月
  { amount: 1800, category: "カフェ", date: "2026-04-31" },
  { amount: 45000, category: "必要経費", date: "2026-04-15" },
  { amount: 3000, category: "ごほうび", date: "2026-04-04" },
  { amount: 15000, category: "推し活", date: "2026-04-01" },
  // 🌸 2026年3月
  { amount: 1200, category: "カフェ", date: "2026-03-28" },
  { amount: 8500, category: "推し活", date: "2026-03-20" },
  { amount: 35000, category: "必要経費", date: "2026-03-15" },
  { amount: 5000, category: "ごほうび", date: "2026-03-05" },

  // 🍫 2026年2月
  { amount: 1500, category: "カフェ", date: "2026-02-14" },
  { amount: 42000, category: "必要経費", date: "2026-02-10" },
  { amount: 12000, category: "ごほうび", date: "2026-02-02" },

  // 🎍 2026年1月
  { amount: 300, category: "わからない", date: "2026-01-25" },
  { amount: 25000, category: "推し活", date: "2026-01-15" },
  { amount: 38000, category: "必要経費", date: "2026-01-05" },

  // 🎄 2025年12月
  { amount: 800, category: "カフェ", date: "2025-12-24" },
  { amount: 15000, category: "ごほうび", date: "2025-12-20" },
  { amount: 50000, category: "必要経費", date: "2025-12-10" },

  // 🍁 2025年11月
  { amount: 9999, category: "ああああああああああ", date: "2025-11-20" },
  { amount: 32000, category: "必要経費", date: "2025-11-10" },
  { amount: 6000, category: "推し活", date: "2025-11-03" },
];

export const getDummySummary = () => {
  return getDummyData.reduce((acc, cur) => acc + cur.amount, 0);
};

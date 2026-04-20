export const getDummyData = [
  // 🎒 2026年4月
  { id: "d-01", amount: 1800, categoryId: "initial_c4", date: "2026-04-30" }, // カフェ
  { id: "d-02", amount: 45000, categoryId: "initial_c1", date: "2026-04-15" }, // 必要経費
  { id: "d-03", amount: 3000, categoryId: "initial_c2", date: "2026-04-04" }, // ごほうび
  { id: "d-04", amount: 3000, categoryId: "initial_c2", date: "2026-04-04" }, // ごほうび
  { id: "d-05", amount: 15000, categoryId: "initial_c3", date: "2026-04-01" }, // 推し活

  // 🌸 2026年3月
  { id: "d-06", amount: 1200, categoryId: "initial_c4", date: "2026-03-28" },
  { id: "d-07", amount: 8500, categoryId: "initial_c3", date: "2026-03-20" },
  { id: "d-08", amount: 35000, categoryId: "initial_c1", date: "2026-03-15" },
  { id: "d-09", amount: 5000, categoryId: "initial_c2", date: "2026-03-05" },

  // 🍫 2026年2月
  { id: "d-10", amount: 1500, categoryId: "initial_c4", date: "2026-02-14" },
  { id: "d-11", amount: 42000, categoryId: "initial_c1", date: "2026-02-10" },
  { id: "d-12", amount: 12000, categoryId: "initial_c2", date: "2026-02-02" },

  // 🎍 2026年1月
  { id: "d-13", amount: 300, categoryId: "initial_c5", date: "2026-01-25" }, // わからない
  { id: "d-14", amount: 25000, categoryId: "initial_c3", date: "2026-01-15" },
  { id: "d-15", amount: 38000, categoryId: "initial_c1", date: "2026-01-05" },

  // 🎄 2025年12月
  { id: "d-16", amount: 800, categoryId: "initial_c4", date: "2025-12-24" },
  { id: "d-17", amount: 15000, categoryId: "initial_c2", date: "2025-12-20" },
  { id: "d-18", amount: 50000, categoryId: "initial_c1", date: "2025-12-10" },

  // 🍁 2025年11月
  { id: "d-19", amount: 9999, categoryId: "initial_c6", date: "2025-11-20" }, // あああああ
  { id: "d-20", amount: 32000, categoryId: "initial_c1", date: "2025-11-10" },
  { id: "d-21", amount: 6000, categoryId: "initial_c3", date: "2025-11-03" },
];

export const getDummySummary = () => {
  return getDummyData.reduce((acc, cur) => acc + cur.amount, 0);
};

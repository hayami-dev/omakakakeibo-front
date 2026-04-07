// 初期値
export const INITIAL_CATEGORIES = [
  { id: "c1", name: "必要経費", isActive: true, colorIndex: 0 },
  { id: "c2", name: "ごほうび", isActive: true, colorIndex: 1 },
  { id: "c3", name: "推し活", isActive: true, colorIndex: 2 },
  { id: "c4", name: "カフェ", isActive: true, colorIndex: 3 },
  { id: "c5", name: "わからない", isActive: true, colorIndex: 4 },
  { id: "c6", name: "ああああああああああ", isActive: true, colorIndex: 5 },
];

const STORAGE_KEY = "myCategories";

export const getCategories = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
};

export const saveCategories = (categories) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
};

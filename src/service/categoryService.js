import { INITIAL_CATEGORIES } from "../categories";

const STORAGE_KEY = "myCategories";

export const getCategories = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
};

export const saveCategories = (categories) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
};

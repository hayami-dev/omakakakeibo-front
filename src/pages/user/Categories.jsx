// カテゴリーの編集画面
import { useState } from "react";
import { getCategories, saveCategories } from "../../service/categoryService";

export default function Categories() {
  const [categories, setCategories] = useState(() => {
    return getCategories();
  });

  const handleInputChange = (id, newName) => {
    const updated = categories.map((cat) =>
      cat.id === id ? { ...cat, name: newName } : cat,
    );
    setCategories(updated); // リアルタイムで更新
  };

  const onSend = () => {
    saveCategories(categories);
    console.log("更新が完了しました");
    return;
  };

  return (
    <>
      <h1>カテゴリーの変更</h1>
      <p>６個のカテゴリー分けができます。</p>
      <section className="category-input-area">
        {categories.map((cat, index) => (
          <div key={cat.id}>
            <label htmlFor={"category-${index}"}>カテゴリー{index + 1}</label>
            <input
              type="text"
              id={"category-${index}"}
              value={cat.name}
              onChange={(e) => handleInputChange(cat.id, e.target.value)}
            />
          </div>
        ))}
      </section>
      <button onClick={onSend}>変更</button>
    </>
  );
}

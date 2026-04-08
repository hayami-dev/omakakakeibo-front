// カテゴリーの編集画面
import { useState } from "react";
import {
  getCategories,
  saveCategories,
  getCategoryStyle,
} from "../../service/categoryService";

export default function Categories() {
  const [categories, setCategories] = useState(() => {
    return getCategories();
  });

  const displayCategories = categories.filter(
    (cat) => !cat.id.includes("_old"),
  );

  const handleInputChange = (id, newName) => {
    const updated = categories.map((cat) =>
      cat.id === id ? { ...cat, name: newName } : cat,
    );
    setCategories(updated); // リアルタイムで更新
  };

  const onSend = () => {
    const currentCategories = getCategories();
    const nextCategories = [];
    const oldCategories = categories.filter((cat) => cat.id.includes("_old"));

    // 現在の入力欄をチェック
    categories
      .filter((cat) => !cat.id.includes("_old"))
      .forEach((cat) => {
        const original = currentCategories.find((old) => old.id === cat.id);

        // 入力に変更があったら元の値をoldへ入れる
        if (original && original.name !== "" && cat.name !== original.name) {
          nextCategories.push({
            ...original,
            id: `${original.id}_old_${Date.now()}`,
            isActive: false,
          });

          // 新しいデータを新しいidをつけて保存する
          nextCategories.push({
            ...cat,
            id: crypto.randomUUID(),
            isActive: true,
          });
        } else {
          // 名前が変わっていない場合
          nextCategories.push({ ...cat, isActive: cat.name !== "" });
        }
      });

    const finalData = [...nextCategories, ...oldCategories];
    saveCategories(finalData);
    setCategories(finalData);
    window.alert("更新が完了しました");
    console.log(finalData);
    return;
  };

  return (
    <>
      <h1>カテゴリーの変更</h1>
      <p>６個のカテゴリー分けができます。</p>
      <section className="category-input-area">
        {displayCategories.map((cat, index) => {
          // 色のスタイルを呼び出し
          const style = getCategoryStyle(cat.colorIndex);
          return (
            <div key={cat.id}>
              <label
                htmlFor={`category-${index}`}
                style={{ color: style.code }}
              >
                {style.label}
              </label>
              <input
                type="text"
                id={`category-${index}`}
                value={cat.name}
                onChange={(e) => handleInputChange(cat.id, e.target.value)}
              />
            </div>
          );
        })}
      </section>
      <button onClick={onSend}>変更</button>
    </>
  );
}

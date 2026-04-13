import { activeCategoriesAtom } from "../../service/categoryService";
import { useAtom } from "jotai";

export default function Categories() {
  const [activeCategories, setActiveCategories] = useAtom(activeCategoriesAtom);

  // リアルタイムで変更を監視
  // 渡されたcat.id,e.target.valueをそれぞれ引数へ
  const handleInputChange = (id, newName) => {
    setActiveCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, name: newName } : cat)),
    );
  };

  const onSend = () => {};

  return (
    <>
      <h1>カテゴリーの変更</h1>
      <p>６個のカテゴリー分けができます。</p>
      <section className="category-input-area">
        {activeCategories.map((cat, index) => {
          return (
            <div key={cat.id}>
              <label
                htmlFor={`activeCategories-${index}`}
                style={{ color: cat.style.code }}
              >
                {cat.style.label}
              </label>
              <input
                type="text"
                id={`activeCategories-${index}`}
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

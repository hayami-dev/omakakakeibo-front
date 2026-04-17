import {
  activeCategoriesAtom,
  archivedCategoriesAtom,
  getActiveCategories,
  saveAllCategories,
} from "../../service/categoryService";
import { useAtom } from "jotai";

export default function CategoryEdit() {
  const [activeCategories, setActiveCategories] = useAtom(activeCategoriesAtom);
  const [archivedCategories, setArchivedCategories] = useAtom(
    archivedCategoriesAtom,
  );

  // リアルタイムで変更を監視
  // 渡されたcat.id,e.target.valueをそれぞれ引数へ
  const handleInputChange = (id, newName) => {
    setActiveCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, name: newName } : cat)),
    );
  };

  // 登録ボタン押下時、LocalStrageに値を保存する
  const onSend = () => {
    // まだ上書きされていないカテゴリを取得
    const currentCategories = getActiveCategories();
    let nextActive = [];
    let nextArchived = { ...archivedCategories };

    activeCategories.forEach((cat) => {
      // 変更前のカテゴリからidが一致するものを取得
      const original = currentCategories[cat.id];
      const originalKey = cat.id;

      // 名前が空欄かつ、idが一致しない場合
      if (cat.name.trim() === "") {
        if (cat.id.includes("_blank")) {
          // すでにblankを持っている(空欄で登録済み)はそのまま返す
          nextActive.push({ ...cat });
        } else {
          // 変更前の値をarchiveへ入れる
          nextArchived[originalKey] = { ...original, id: originalKey };
          // 変更後はactiveへ入れる
          nextActive.push({
            id: `${cat.id}_blank_${Date.now()}`,
            name: "",
            colorIndex: cat.colorIndex,
          });
        }
      }
      // 名前が変更された場合（originalと名前が一致するかどうか）
      else if (original && cat.name !== original.name) {
        nextArchived[originalKey] = { ...original, id: originalKey };

        nextActive.push({
          id: crypto.randomUUID(),
          name: cat.name,
          colorIndex: cat.colorIndex,
        });
      }
      //名前が変わっていない場合
      else {
        nextActive.push({ ...cat });
      }
    });
    // LocalStorageに保存
    saveAllCategories(nextActive, nextArchived);

    //Atom更新
    setActiveCategories(nextActive);
    setArchivedCategories(nextArchived);
  };

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

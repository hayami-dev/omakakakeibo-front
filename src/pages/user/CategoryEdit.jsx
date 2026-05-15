import {
  activeCategoriesAtom,
  checkAlreadyEditCategory,
  resetLastEditDate,
} from "../../service/categoryService";
import { useAtom } from "jotai";

export default function CategoryEdit() {
  const [activeCategories, setActiveCategories] = useAtom(activeCategoriesAtom);

  //カテゴリの変更が可能かどうか
  const today = new Date();
  const isEdit = checkAlreadyEditCategory(today);

  // リアルタイムで変更を監視
  // 渡されたcat.activeCatId,e.target.valueをそれぞれ引数へ
  const handleInputChange = (id, newName) => {
    setActiveCategories((prev) =>
      prev.map((cat) =>
        cat.activeCatId === id ? { ...cat, categoryName: newName } : cat,
      ),
    );
  };

  // 登録ボタン押下時、DB(カテゴリマスタ)に値を保存する
  const onSend = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/categories/update",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(activeCategories),
        },
      );

      if (response.ok) {
        alert("保存しました！");
      }
    } catch {
      console.error("保存失敗:");
    }
  };

  /**
   * TODO:開発用リセットボタンなので不要になったら消すこと
   */
  const handleReset = () => {
    resetLastEditDate();
    window.location.reload();
  };

  return (
    <>
      <h1>カテゴリーの変更</h1>
      <p>６個のカテゴリー分けができます。</p>
      <section className="category-input-area">
        {activeCategories.map((cat, index) => {
          return (
            <div key={cat.activeCatId || index}>
              <label
                htmlFor={`activeCategories-${index}`}
                style={{ color: cat.style.color }}
              >
                {cat.style.label}
              </label>
              <input
                type="text"
                id={`activeCategories-${index}`}
                value={cat.categoryName || ""}
                onChange={(e) =>
                  handleInputChange(cat.activeCatId, e.target.value)
                }
              />
            </div>
          );
        })}
      </section>
      <button onClick={onSend} disabled={!isEdit}>
        変更
      </button>
      <br />
      {!isEdit && <span>カテゴリの変更は1日1回までです。</span>}
      {/* デバッグ用：開発中だけ表示する */}
      <button
        onClick={handleReset}
        style={{ opacity: 0.5, fontSize: "0.7rem", marginLeft: "10px" }}
      >
        (Debug) 制限リセット
      </button>
    </>
  );
}

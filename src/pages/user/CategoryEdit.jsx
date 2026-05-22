/* ユーザー毎のカテゴリの変更画面 */

import {
  categoryService,
  activeCategoriesAtom,
  checkAlreadyEditCategory,
} from "../../service/categoryService";
import { useAtom } from "jotai";

export default function CategoryEdit() {
  const [activeCategories, setActiveCategories] = useAtom(activeCategoriesAtom);

  //カテゴリの変更が可能かどうか
  const today = new Date();
  const isEdit = checkAlreadyEditCategory(today, activeCategories);

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
    categoryService.saveCategories(activeCategories);
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
      <button onClick={onSend}>(Debug)変更</button>
    </>
  );
}

// カテゴリーの編集画面
export default function Categories() {
  // 処理
  return (
    <>
      <h1>カテゴリーの変更</h1>
      <p>６個のカテゴリー分けができます。</p>
      <section className="category-input-area">
        <div>
          <label htmlFor="category1">カテゴリー１</label>
          <input type="text" id="category1" />
        </div>
        <div>
          <label htmlFor="category2">カテゴリー２</label>
          <input type="text" id="category2" />
        </div>
        <div>
          <label htmlFor="category3">カテゴリー３</label>
          <input type="text" id="category3" />
        </div>
        <div>
          <label htmlFor="category4">カテゴリー４</label>
          <input type="text" id="category4" />
        </div>
        <div>
          <label htmlFor="category5">カテゴリー５</label>
          <input type="text" id="category5" />
        </div>
        <div>
          <label htmlFor="category6">カテゴリー６</label>
          <input type="text" id="category6" />
        </div>
      </section>
      <button>変更</button>
    </>
  );
}

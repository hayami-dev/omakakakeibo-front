import { useState } from "react";
import "./App.css";
import { AiFillCloseCircle } from "react-icons/ai";

function App() {
  // 現在の値, 👈セッター(入れ込む仕組み)
  const [inputValue, setInputValue] = useState(""); // 入力中の文字列
  const [result, setResult] = useState(0);
  const [history, setHistory] = useState([]);
  const categories = [
    "必要経費",
    "ごほうび",
    "推し活",
    "カフェ",
    "わからない",
    "ああああああああああ",
  ];
  const [selectCategory, setSlectCategory] = useState("");

  const handleSend = () => {
    const amount = Number(inputValue); // 数値に加工

    // 入力チェック
    if (!inputValue || isNaN(amount) || amount <= 0) {
      alert("1円以上で入力してください");
      return;
    }
    // タグ未選択の場合
    if (selectCategory == "") {
      alert("タグを選択してください");
      return;
    }

    // Javaだと total = total + Integer.parseInt(inputValue);
    setResult(result + amount); // 入力値を結果にセット

    // タグ情報も付随させる
    const newRecord = {
      amount: amount,
      category: selectCategory,
    };

    // 履歴に追加
    setHistory([...history, newRecord]);

    // カテゴリ毎の集計

    setInputValue(""); //入力欄を空にする
  };

  const categoryTotals = history.reduce(
    (acc, cur) => {
      const { category, amount } = cur;
      // Mapの中にそのカテゴリがすでにあれば加算、なければ初期値から加算
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    },
    {}, // 👈初期値
  );

const removeHistory = (targetIndex)=> {
  // indexがtargetIndexじゃないものだけ残す(配列を直で消せない)
  const newHistory = history.filter((_, index)=> index !== targetIndex);

  // 新しい配列をセッターをつかって上書き
  setHistory(newHistory);

  // 合計金額(result)も減らす
  const deletedItem = history[targetIndex];
  setResult(result - deletedItem.amount);
};

  return (
    // 必ず1つの要素でreturnしなければいけない
    <>
      <main>
        <h1>おおまか家計簿</h1>

        {/* 結果表示 */}
        <section>
          <p>
            合計：
            <strong>{result.toLocaleString("ja-JP")}円</strong>
          </p>
        </section>
        {/* 入力 */}
        <section>
          <input
            type="number"
            value={inputValue}
            placeholder="金額を入力"
            onChange={(e) => setInputValue(e.target.value)}
            // 👆のvalueに変更された値をセットする
            onKeyDown={(e) =>
              ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
            }
            // 一部の半角文字を入力できないようにする
          />
          <div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSlectCategory(cat)}
                style={{
                  backgroundColor: selectCategory === cat ? "yellow" : "white",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <button onClick={handleSend}>送信</button>
        </section>
        <section>
          <h2>りれき</h2>
          <ul>
            {history.map((item, index) => (
              <li key={index}>
                【{item.category}】{item.amount.toLocaleString("ja-JP")}円
                <AiFillCloseCircle onClick={() => removeHistory(index)}/>
              </li>
            ))}
          </ul>

          <h3>カテゴリ毎の集計</h3>
          <ul>
            {Object.entries(categoryTotals).map(([cat, sum]) => (
              <li key={cat}>
                {cat}:{sum.toLocaleString()}円
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}

export default App;

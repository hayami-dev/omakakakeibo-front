import { NavLink } from "react-router";

// ユーザー個別の情報の表示画面
export default function User() {
  // 処理
  return (
    <>
      <NavLink to="/user/categoryEdit">📝 カテゴリー</NavLink>
    </>
  );
}

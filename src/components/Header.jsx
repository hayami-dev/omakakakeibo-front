/* 共通ヘッダー */

import { NavLink } from "react-router";

export default function Header() {
  // 処理
  return (
    <header>
      <NavLink to="/">ホーム</NavLink>
      <NavLink to="/user">マイページ</NavLink>
    </header>
  );
}

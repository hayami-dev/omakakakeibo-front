/* 共通ヘッダー */

import { NavLink } from "react-router";
import logo from "@/assets/logo.svg";
import setting from "@/assets/icons/setting.svg";

export default function Header() {
  // 処理
  return (
    <header className="w-full self-stretch bg-bg leading-none grid grid-cols-12 place-items-center">
      <h1 className="w-fit leading-none col-start-5 col-span-4  m-space-200">
        <NavLink to="/">
          <img
            src={logo}
            alt="おおまか家計簿ロゴ"
            className="h-auto w-[70px]"
          />
        </NavLink>
      </h1>
      <div className="w-fit col-start-11 col-span-2">
        <NavLink to="/user">
          <img src={setting} alt="マイページへ" />
        </NavLink>
      </div>
    </header>
  );
}

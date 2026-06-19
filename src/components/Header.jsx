/* 共通ヘッダー */

import { useLocation, useNavigate, NavLink } from "react-router";
import logo from "@/assets/logo.svg";
import setting from "@/assets/icons/setting.svg";
import ChevronRightIcon from "@/assets/icons/ChevronRightIcon";

export default function Header() {
  // 現在のURL情報を取得
  const location = useLocation();
  // 画面遷移用のフック
  const navigate = useNavigate();

  const showBackButtonPages = [
    "/user",
    "/user/budgetEdit",
    "/user/categoryEdit",
  ];

  const handlePageChange = () => {
    if (location.pathname === "/user") {
      navigate("/");
    } else {
      navigate(-1);
    }
  };

  const isShowBackButton = showBackButtonPages.includes(location.pathname);

  return (
    <header className="w-full self-stretch bg-bg leading-none grid grid-cols-12 place-items-center">
      <div className="col-span-2 rotate-180">
        {isShowBackButton && (
          <button onClick={handlePageChange} className="text-text-cap">
            <ChevronRightIcon />
          </button>
        )}
      </div>
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

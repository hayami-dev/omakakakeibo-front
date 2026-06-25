// ルート
import { Route, Routes, Outlet } from "react-router";
import Home from "@/pages/Home";
import InputHistory from "@/pages/InputHistory";
import User from "@/pages/User";
import CategoryEdit from "@/pages/user/CategoryEdit";
import Header from "@/components/Header";
import BudgetEdit from "@/pages/user/BudgetEdit";
import Login from "@/pages/auth/login/Login";
// component
import Toast from "@/components/ui/Toast";
import RegisterContainer from "./pages/auth/register/RegisterContainer";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      {/* トースト通知 */}
      <Toast />

      {/* すべての画面ルート */}
      <Routes>
        {/* ログイン前 */}
        <Route path="/auth">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<RegisterContainer />} />
          {/* トークン認証用 */}
          <Route path="register/verify" element={<RegisterContainer />} />
        </Route>

        {/* ログイン後 */}
        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <>
                <Header />
                <Outlet /> {/* ここにHomeやUserが入る！ */}
              </>
            }
          >
            {/* ホーム */}
            <Route path="/" element={<Home />}>
              {/* ダイアログ */}
              <Route path="input" element={<InputHistory />} />
            </Route>

            {/* ユーザーページ */}
            <Route path="user" element={<User />} />
            <Route path="user/categoryEdit" element={<CategoryEdit />} />
            <Route path="user/budgetEdit" element={<BudgetEdit />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;

/* Homeに表示させる固定フッター */

import { useNavigate } from "react-router";
import Button from "@/components/ui/Button";
import MoneyBag from "@/assets/icons/MoneyBag";

export default function Footer() {
  // ページ切替のためのフック
  const navigate = useNavigate();

  // 処理
  return (
    <footer className="sticky bottom-0 flex justify-center self-stretch bg-bg p-space-400 shadow-[0_1px_12px] shadow-(--color-shadow) ">
      <nav>
        <Button
          variant="primary"
          size="lg"
          icon={MoneyBag}
          onClick={() => navigate("/input")}
        >
          おかねをきろくする
        </Button>
      </nav>
    </footer>
  );
}

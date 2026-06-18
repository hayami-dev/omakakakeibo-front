/* 読み込み時に表示するローディングアニメ */
import logo from "@/assets/logo.svg";
export default function LoadingAnime() {
  return (
    <>
      <div className="inline-block animate-[coin-flip_2.5s_ease-in-out_infinite,pulse_2s_infinite]">
        <img src={logo} alt="おおまか家計簿ロゴ" className="h-auto w-[120px]" />
      </div>
      <style>
        {`
        @keyframes coin-flip {
          0% { transform: scaleX(1); }
          50% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
      `}
      </style>
    </>
  );
}

import { ExpenseBreakdownSection } from "./ExpenseBreakdownSection";
import image from "./image.svg";
import { MoneyBag24Dp1F1F1FFill0Wght300Grad0Opsz241 } from "./MoneyBag24Dp1F1F1FFill0Wght300Grad0Opsz241";
import { MonthlySummarySection } from "./MonthlySummarySection";
import vector from "./vector.svg";
import vector2 from "./vector-2.svg";
import vector3 from "./vector-3.svg";
import vector4 from "./vector-4.svg";
import vector5 from "./vector-5.svg";
import vector6 from "./vector-6.svg";

const logoVectors = [
  {
    src: vector,
    alt: "Vector",
    className: "absolute top-2.5 left-[37px] w-[18px] h-[18px]",
  },
  {
    src: image,
    alt: "Vector",
    className: "absolute top-[11px] left-[18px] w-[18px] h-[18px]",
  },
  {
    src: vector2,
    alt: "Vector",
    className: "absolute top-2.5 left-0 w-[17px] h-[18px]",
  },
  {
    src: vector3,
    alt: "Vector",
    className: "absolute top-px left-9 w-[9px] h-[7px]",
  },
  {
    src: vector4,
    alt: "Vector",
    className: "absolute top-0 left-7 w-[7px] h-[7px]",
  },
  {
    src: vector5,
    alt: "Vector",
    className: "absolute top-px left-[19px] w-2 h-[7px]",
  },
  {
    src: vector6,
    alt: "Vector",
    className: "absolute top-px left-2.5 w-2 h-[7px]",
  },
];

export const Element = (): JSX.Element => {
  return (
    <div className="relative flex min-h-[888px] w-full flex-col items-center overflow-x-hidden bg-section-bg">
      <header className="relative z-10 h-[44.47px] w-full self-stretch bg-bg">
        <div className="absolute left-[152px] top-2 inline-flex items-start justify-center gap-[4.69px] pt-[var(--none)] pr-[var(--md)] pb-[var(--none)] pl-[var(--md)]">
          <div
            className="relative h-[28.47px] w-[54.98px]"
            aria-label="アプリロゴ"
          >
            {logoVectors.map((item, index) => (
              <img
                key={`${item.src}-${index}`}
                className={item.className}
                alt={item.alt}
                src={item.src}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          aria-label="設定"
          className="absolute left-[335px] top-2.5 h-6 w-6 bg-[url(/settings.svg)] bg-[100%_100%]"
        />
      </header>
      <main className="flex w-full flex-col items-center">
        <MonthlySummarySection />
        <ExpenseBreakdownSection />
      </main>
      <div className="fixed left-px top-[741px] z-20 flex w-[375px] flex-col items-center justify-center gap-2.5 bg-bg px-0 pt-[var(--md)] pb-[var(--md)] shadow-[0px_-4px_4px_#00000040]">
        <div className="relative inline-flex flex-[0_0_auto] items-start">
          <button
            type="button"
            aria-label="おかねをきろくする"
            className="relative inline-flex flex-[0_0_auto] items-center justify-center gap-[var(--size-space-200)] overflow-hidden rounded-[var(--size-radius-200)] border border-solid border-main-colormain bg-main-colormain pt-[var(--md)] pr-[var(--size-space-300)] pb-[var(--md)] pl-[var(--size-space-300)]"
          >
            <MoneyBag24Dp1F1F1FFill0Wght300Grad0Opsz241 className="!relative !flex-[0_0_auto]" />
            <span className="relative mt-[-1.00px] w-fit whitespace-nowrap [font-family:'Zen_Maru_Gothic-Bold',Helvetica] text-xl font-bold leading-5 tracking-[0] text-buttontext">
              おかねをきろくする
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

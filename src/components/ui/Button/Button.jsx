// ボタンコンポーネント

export default function PrimaryButton({
  children,
  variant = "main",
  size = "md",
  icon,
  onClick,
  disabled = false,
}) {
  // ボタンの基本スタイル
  const baseStyle =
    "font-bold rounded-md transition-colors inline-flex items-center justify-center gap-space-200 w-fit";

  // 色のバリエーション
  const variantStyles = {
    primary:
      "bg-main-default text-button-text border-current border-1 hover:bg-main-soft",
    secondary: "border-1 border-current text-main-default hover:bg-main-bg",
    text: "text-sub-default hover:bg-sub-bg",
  };

  // 文字サイズのバリエーション
  const sizeStyles = {
    sm: "text-xs px-space-200 py-space-100",
    md: "text-base px-space-400 py-space-200",
    lg: "text-xl px-space-500 py-space-300",
  };

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={children}
        className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]}`}
      >
        {icon && <img src={icon} alt="" className="w-[1.25em] h-[1.25em]" />}
        <span className={variant === "text" ? "border-b-1" : ""}>
          {children}
        </span>
      </button>
    </>
  );
}

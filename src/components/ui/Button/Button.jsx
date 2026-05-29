// ボタンコンポーネント

export default function Button({
  type = "button",
  children,
  variant = "primary",
  size = "md",
  icon,
  onClick,
  disabled = false,
  className = "",
}) {
  // ボタンの基本スタイル
  const baseStyle =
    "font-bold rounded-md transition-colors inline-flex items-center justify-center gap-space-200 w-full disabled:cursor-not-allowed";

  // 色のバリエーション
  const variantStyles = {
    primary:
      "bg-main-default text-button-text border-current border-1 hover:bg-main-soft disabled:bg-disabled-soft disabled:text-disabled-default disabled:border-none disabled:pointer-events-none",
    secondary:
      "border-1 border-current text-main-default bg-secondary-button-bg hover:bg-main-bg disabled:text-disabled-default disabled:pointer-events-none",
    text: "text-sub-default hover:bg-sub-bg",
    delete: "font-medium text-error-default bg-error-bg",
  };

  // 文字サイズのバリエーション
  const sizeStyles = {
    sm: "text-sm p-space-200",
    md: "text-base px-space-400 py-space-200",
    lg: "text-xl px-space-500 py-space-300",
  };

  return (
    <>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        aria-label={children}
        className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      >
        {/* アイコンの自動判別 */}
        {icon && (
          <>
            {typeof icon === "string" ? (
              // iconが文字列（URLやパス）のときはimgタグ
              <img
                src={icon}
                alt=""
                className="w-[1.25em] h-[1.25em] object-contain"
              />
            ) : (
              // iconがJSXコンポーネント（関数）のときは、カスタムタグとして実行
              // そのままだとサイズが崩れることがあるのでdivで包んでサイズを強制固定
              <div className="w-[1.25em] h-[1.25em] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
                {/* Reactの仕様にあわせ、コンポーネント（関数）として呼び出し */}
                {typeof icon === "function" ? icon({}) : icon}
              </div>
            )}
          </>
        )}
        {/* 💡 ここまで */}
        <span className={variant === "text" ? "border-b-1" : ""}>
          {children}
        </span>
      </button>
    </>
  );
}

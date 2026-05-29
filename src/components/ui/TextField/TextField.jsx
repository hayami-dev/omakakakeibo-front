/* 金額、日付、テキストを入力する用の汎用テキストフィールド */

export default function TextField({
  type = "text",
  id,
  placeholder = "",
  value,
  onChange = () => {},
  onKeyDown = () => {},
  onBlur = () => {},
  className = "",
  size = "md",
  maxLength = "",
  minLength = "",
  count = false,
  currentLength = "",
  isError = false,
}) {
  // 基本スタイル
  const baseStyle =
    "bg-input-bg border-border border font-bold rounded-lg focus:border-main-default w-full";

  // 文字サイズのバリエーション
  const sizeStyles = {
    md: "text-base p-space-200",
    lg: "text-2xl p-space-300",
  };

  // 数値の入力の場合、一部の半角文字を入力できないようにする
  const handleKeyDown = (e) => {
    if (type === "number" && ["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
      return;
    }

    // 親からもし処理が渡されていたら、それを実行
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  const alignStyle = type === "number" ? "text-right" : "";

  return (
    <div id="text-field-wrap" className="flex flex-col w-full relative ">
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        className={`${baseStyle} ${sizeStyles[size]} ${className} ${alignStyle} ${
          isError ? "!bg-error-bg" : ""
        }`}
        min={minLength}
        max={maxLength}
        // もしtypeがdateだった場合にクリックでピッカーを表示させる
        onClick={(e) => {
          if (type === "date" && e.target.showPicker) {
            e.target.showPicker();
          }
        }}
      />

      {count && (
        <div className="absolute text-text-cap text-xs bottom-[-16px] right-0">
          {currentLength}/{maxLength}
        </div>
      )}
    </div>
  );
}

/* 金額、日付、テキストを入力する用の汎用テキストフィールド */

export default function TextField({
  type = "text",
  id,
  placeholder,
  value,
  onChange,
  onKeyDown,
  className = "",
  size = "md",
}) {
  // 基本スタイル
  const baseStyle =
    "bg-input-bg border-input-border border font-bold rounded-lg focus:border-main-default";

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
    <>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          if (onChange) onChange(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        className={`${baseStyle} ${sizeStyles[size]} ${className} ${alignStyle}`}
      />
    </>
  );
}

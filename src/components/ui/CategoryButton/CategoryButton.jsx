/* カテゴリを選択する際のUI */
import { getSafeColor } from "@/categoryColor";
import Check from "@/assets/icons/category/Check";
import NotChecked from "@/assets/icons/category/NotChecked";

export default function CategoryButton({
  catName,
  catStyle,
  onClick,
  isSelected,
  readOnly = false,
  className = "",
}) {
  // 読み取り専用時は選択中のUIにする
  isSelected = readOnly ? true : isSelected;

  const baseStyle =
    "flex gap-4 items-center justify-center text-base text-lg font-black rounded-full border transition-all w-full px-4 py-2";

  const textColor = getSafeColor(catStyle?.color);
  const bgColor = getSafeColor(catStyle?.backgroundColor);
  const disabledColor = getSafeColor(catStyle?.disabledColor);

  const activeStyle = {
    color: textColor,
    backgroundColor: isSelected ? bgColor : "white",
    borderColor: textColor,
    opacity: readOnly ? "1" : isSelected ? "1" : "0.6",
    boxShadow: isSelected ? `0 4px 4px ${disabledColor}4D` : "none",
    cursor: readOnly ? "default" : "pointer",
  };

  // 処理
  return (
    <>
      <button
        type="button"
        className={`${baseStyle} ${className}`}
        onClick={readOnly ? undefined : onClick}
        style={activeStyle}
      >
        {readOnly ? null : isSelected ? <Check /> : <NotChecked />}
        <span>{catName}</span>
      </button>
    </>
  );
}

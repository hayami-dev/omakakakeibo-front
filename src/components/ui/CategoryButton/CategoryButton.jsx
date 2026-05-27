/* カテゴリを選択する際のUI */
import { getSafeColor } from "@/categoryColor";
import Check from "@/assets/icons/category/Check";
import NotChecked from "@/assets/icons/category/NotChecked";

export default function CategoryButton({
  catName,
  catStyle,
  onClick,
  isSelected,
  size = "md",
}) {
  const baseStyle =
    "flex gap-4 items-center justify-center text-lg font-black px-4 py-2 rounded-full border transition-all w-full";

  const sizeStyle = {
    md: "",
    sm: "scale-75",
  };

  const textColor = getSafeColor(catStyle?.color);
  const bgColor = getSafeColor(catStyle?.backgroundColor);
  const disabledColor = getSafeColor(catStyle?.disabledColor);

  const activeStyle = {
    color: textColor,
    backgroundColor: isSelected ? bgColor : "white",
    borderColor: textColor,
    opacity: isSelected ? "1" : "0.6",
    boxShadow: isSelected ? `0 4px 4px ${disabledColor}4D` : "none",
  };

  // 処理
  return (
    <>
      <button
        type="button"
        className={`${baseStyle} ${sizeStyle[size]}`}
        onClick={onClick}
        style={activeStyle}
      >
        {isSelected ? <Check /> : <NotChecked />}

        <span>{catName}</span>
      </button>
    </>
  );
}

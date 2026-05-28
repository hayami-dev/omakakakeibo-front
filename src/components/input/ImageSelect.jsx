/* ランダムに画像を表示する */
import { useState } from "react";
const images = import.meta.glob("@/assets/input/*.svg", {
  eager: true,
  import: "default",
});

const iconList = Object.entries(images).map(([path, url]) => {
  const name = path.split("/").pop().replace(".svg", "");
  return { name, url };
});

export default function ImageSelect() {
  const [randomIcon] = useState(() => {
    if (iconList.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * iconList.length);
    return iconList[randomIndex];
  });

  return (
    <>
      {randomIcon && (
        <img src={randomIcon.url} alt={randomIcon.name} className="" />
      )}
    </>
  );
}

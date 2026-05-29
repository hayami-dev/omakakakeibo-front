/* (!)のアイコン付きの注釈テキスト */

import { Children } from "react";
import AlertCircleIcon from "@/assets/icons/AlertCircleIcon";

export default function AttentionText({ children }) {
  return (
    <p className="flex gap-2 text-text-cap text-xs w-fit">
      <span className="flex-shrink-0 mt-[-2px]">
        <AlertCircleIcon />
      </span>
      {children}
    </p>
  );
}

import { atom } from "jotai";

export const toastAtom = atom({
  show: false,
  message: "",
  type: "success",
});

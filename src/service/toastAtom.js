import { atom } from "jotai";

export const toastAtom = atom({
  show: true,
  message: "",
  type: "success",
});

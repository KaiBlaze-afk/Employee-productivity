import { atom } from "recoil";

export const voiceState = atom({
  key: "voiceState",
  default: "",
});

export const isListeningState = atom({
  key: "isListeningState",
  default: false,
});

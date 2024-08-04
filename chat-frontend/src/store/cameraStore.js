import { create } from "zustand";

export const useCameraStore = create((set) => ({
  onCamera: false,
  turn: () =>
    set((state) => ({
      onCamera: !state.onCamera
    })),
}));

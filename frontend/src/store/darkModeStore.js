import { create } from "zustand"

export const useDarkModeStore = create((set) => ({
    darkMode: false,
    turn: () => {
        set((state) => ({
            darkMode: !state.darkMode
        }))
    }
}))
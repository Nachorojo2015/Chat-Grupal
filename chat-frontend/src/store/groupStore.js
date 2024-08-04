import { create } from "zustand";

export const useGroupStore = create((set) => ({
  idGroup: "",
  photo: "",
  name: "",
  messages: [],
  admin: "",
  setGroup: (id, photo, name, messages, admin) =>
    set({
      idGroup: id,
      photo: photo,
      name: name,
      messages: messages,
      admin: admin,
    }),
  setMessages: (messages) =>
    set({
      messages: messages,
    }),
}));

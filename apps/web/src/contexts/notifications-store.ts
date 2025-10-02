import { create } from "zustand";

type Notification = { id: number; title: string; read: boolean };

type NotificationsState = {
  items: Notification[];
  unreadCount: number;
  add: (title: string) => void;
  markAllRead: () => void;
};

export const useNotificationsStore = create<NotificationsState>((set) => ({
  items: [],
  unreadCount: 0,
  add: (title) =>
    set((s) => ({
      items: [{ id: Date.now(), title, read: false }, ...s.items],
      unreadCount: s.unreadCount + 1,
    })),
  markAllRead: () =>
    set((s) => ({
      items: s.items.map((i) => ({ ...i, read: true })),
      unreadCount: 0,
    })),
}));

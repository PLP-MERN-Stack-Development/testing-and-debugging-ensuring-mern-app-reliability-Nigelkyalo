import { create } from 'zustand';

const generateId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const useNotifications = create((set) => ({
  notifications: [],
  pushNotification: ({ type, title, message }) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: generateId(),
          type,
          title,
          message,
          timestamp: new Date().toISOString()
        }
      ]
    })),
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id)
    })),
  clearAll: () => set({ notifications: [] })
}));



import { createContext } from 'react';
import { Notification, AuditLog, Topic } from './types';

export const AuthContext = createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const NotificationContext = createContext({
  notifications: [] as Notification[],
  auditLogs: [] as AuditLog[],
  topics: [] as Topic[],
  createTopic: async (name: string, description: string) => {},
  toggleTopicSubscription: async (id: string, subscribed: boolean) => {},
  addNotification: async (notification: Omit<Notification, 'id' | 'created_at' | 'timestamp' | 'acknowledged' | 'resolved' | 'comments' | 'snoozed_until'>) => {},
  acknowledgeNotification: (id: number) => {},
  resolveNotification: (id: number) => {},
  snoozeNotification: (id: number, snoozeUntil: string) => {},
  addComment: (id: number, text: string) => {},
  unreadCount: 0,
  soundEnabled: true,
  setSoundEnabled: (enabled: boolean) => {},
  isPushSupported: false,
  pushPermissionStatus: 'default' as NotificationPermission,
  requestPushPermission: async () => {},
});

export const ThemeContext = createContext({
    theme: 'light' as 'light' | 'dark',
    toggleTheme: () => {},
});

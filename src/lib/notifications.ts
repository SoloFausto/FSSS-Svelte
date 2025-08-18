// Simple notification (toast) system
// Usage: import { notify } from '$lib/notifications';
// notify({ type: 'error', message: 'Something went wrong' });

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  timeout?: number; // ms
}

import { writable } from 'svelte/store';

function createNotifications() {
  const { subscribe, update } = writable<Notification[]>([]);
  let counter = 0;

  function push(n: Omit<Notification, 'id'>) {
    const id = ++counter;
    const timeout = n.timeout ?? (n.type === 'error' ? 6000 : 4000);
    update(list => [...list, { ...n, id, timeout }]);
    if (timeout > 0) {
      setTimeout(() => dismiss(id), timeout);
    }
    return id;
  }

  function dismiss(id: number) {
    update(list => list.filter(n => n.id !== id));
  }

  return { subscribe, push, dismiss };
}

export const notifications = createNotifications();

export function notify(opts: { type?: NotificationType; message: string; timeout?: number }) {
  return notifications.push({ type: opts.type ?? 'info', message: opts.message, timeout: opts.timeout });
}

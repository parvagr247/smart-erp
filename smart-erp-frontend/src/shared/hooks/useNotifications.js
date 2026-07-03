import { useState, useMemo } from 'react';

const INITIAL_MOCK_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'GST Deadline Reminder',
    desc: 'GSTR-1 filing deadline for the current quarter is in 5 days.',
    time: '2 hours ago',
    type: 'warning',
    isRead: false,
  },
  {
    id: 'n2',
    title: 'Low Stock Alert',
    desc: 'Item "Industrial Motor 5HP" is below the reorder point of 10 units.',
    time: '4 hours ago',
    type: 'danger',
    isRead: false,
  },
  {
    id: 'n3',
    title: 'Welcome to SmartERP',
    desc: 'Your company workspace has been initialized successfully. Let\'s configure master files!',
    time: '1 day ago',
    type: 'info',
    isRead: true,
  },
];

export default function useNotifications() {
  const [notifications, setNotifications] = useState(INITIAL_MOCK_NOTIFICATIONS);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}

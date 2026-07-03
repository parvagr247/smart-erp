import { useState, useEffect, useCallback } from 'react';
import axiosClient from '@shared/api/axios-client';
import { useActiveCompany } from '@shared/context/ActiveCompanyContext';

export default function useNotifications() {
  const { activeCompany } = useActiveCompany();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!activeCompany?.id) return;
    try {
      const res = await axiosClient.get('/notifications');
      if (res.data?.success) {
        setNotifications((res.data.data || []).map(n => ({
          id: n.id,
          title: n.title,
          desc: n.message,
          time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: n.read
        })));
      }
      
      const countRes = await axiosClient.get('/notifications/unread-count');
      if (countRes.data?.success) {
        setUnreadCount(countRes.data.data || 0);
      }
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  }, [activeCompany?.id]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await axiosClient.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosClient.patch('/notifications/read-all');
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  };
}

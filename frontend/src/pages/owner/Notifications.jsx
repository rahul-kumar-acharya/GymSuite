import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, AlertTriangle, CreditCard, Clock } from 'lucide-react';
import api from '../../services/api';

const icons = {
  MEMBERSHIP_EXPIRING: Clock,
  PAYMENT_RECEIVED: CreditCard,
  PAYMENT_PENDING: AlertTriangle,
  TRIAL_ALERT: AlertTriangle,
  SYSTEM: Bell,
};

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications/');
      setNotifications(response.data.results || response.data);
      setError('');
    } catch {
      setError('Notifications could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (notification) => {
    if (notification.is_read) return;
    await api.post(`/notifications/${notification.id}/mark-read/`);
    setNotifications((items) => items.map((item) => (
      item.id === notification.id ? { ...item, is_read: true } : item
    )));
  };

  const markAllRead = async () => {
    await api.post('/notifications/mark-all-read/');
    setNotifications((items) => items.map((item) => ({ ...item, is_read: true })));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-espresso-800">Notifications</h1>
          <p className="text-xs text-mutedGray">Important updates for your gym and members.</p>
        </div>
        <button type="button" onClick={markAllRead} className="inline-flex items-center gap-2 rounded-lg border border-sand px-3 py-2 text-xs font-semibold text-espresso-800 hover:bg-white">
          <CheckCheck className="h-4 w-4" />
          Mark all read
        </button>
      </div>

      {error && <div className="rounded-xl bg-statusRed-bg px-4 py-3 text-xs font-semibold text-statusRed-text">{error}</div>}
      <div className="overflow-hidden rounded-2xl border border-sand bg-white">
        {loading ? (
          <p className="p-8 text-center text-xs text-mutedGray">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="p-8 text-center text-xs text-mutedGray">You are all caught up.</p>
        ) : (
          <div className="divide-y divide-sand">
            {notifications.map((notification) => {
              const Icon = icons[notification.notification_type] || Bell;
              return (
                <button
                  type="button"
                  key={notification.id}
                  onClick={() => markRead(notification)}
                  className={`flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-cream-50 ${notification.is_read ? '' : 'bg-cream-100/60'}`}
                >
                  <span className="mt-0.5 rounded-lg bg-espresso-800 p-2 text-brass-400"><Icon className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-espresso-800">{notification.title}</span>
                    <span className="mt-1 block text-xs text-mutedGray">{notification.message}</span>
                    <span className="mt-2 block text-[10px] font-semibold uppercase text-brass-600">{new Date(notification.created_at).toLocaleString()}</span>
                  </span>
                  {!notification.is_read && <span className="mt-2 h-2 w-2 rounded-full bg-brass-500" aria-label="Unread" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

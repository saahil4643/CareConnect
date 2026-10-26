import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationDropdown: React.FC = () => {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notifId: string, requestId?: string) => {
    await markNotificationRead(notifId);
    setIsOpen(false);
    if (requestId) {
      navigate(`/requests/${requestId}`);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-slate-900 text-sm">Notifications</h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllNotificationsRead()}
                className="text-xs text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">
                No notifications right now.
              </div>
            ) : (
              notifications.slice(0, 10).map(notif => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.id, notif.requestId)}
                  className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 ${
                    !notif.read ? 'bg-teal-50/40' : ''
                  }`}
                >
                  <span
                    className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                      !notif.read ? 'bg-teal-600' : 'bg-transparent'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{notif.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {new Date(notif.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {notif.requestId && (
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-1" />
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-500">
              In-app demo notifications • Email & SMS integration coming in Django backend
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

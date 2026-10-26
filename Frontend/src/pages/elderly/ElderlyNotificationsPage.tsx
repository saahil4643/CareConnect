import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Bell, Check, ExternalLink, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ElderlyNotificationsPage: React.FC = () => {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleNotificationClick = async (notifId: string, requestId?: string) => {
    await markNotificationRead(notifId);
    if (requestId) {
      navigate(`/requests/${requestId}`);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Notifications & Updates</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time confirmations, volunteer assignments, and task status milestones.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllNotificationsRead()}
            icon={<Check className="w-4 h-4" />}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="text-center py-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Notifications</h3>
          <p className="text-xs text-slate-500 mt-1">You’re all caught up!</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map(notif => (
            <Card
              key={notif.id}
              onClick={() => handleNotificationClick(notif.id, notif.requestId)}
              className={`p-4 cursor-pointer hover:border-teal-300 transition-all flex items-start gap-3.5 ${
                !notif.read ? 'bg-teal-50/40 border-teal-200' : 'bg-white'
              }`}
            >
              <div
                className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                  !notif.read ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Bell className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {new Date(notif.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                {notif.requestId && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-teal-700 font-semibold mt-2">
                    <span>View Request {notif.requestId}</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

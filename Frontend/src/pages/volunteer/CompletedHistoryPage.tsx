import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CategoryIcon } from '../../components/ui/CategoryIcon';
import { Star, CheckCircle2, Calendar, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CompletedHistoryPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { requests } = useData();

  const completedTasks = requests.filter(
    r => r.assignedVolunteerId === currentUser?.id && r.status === 'completed'
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-black text-slate-900">Completed Assistance History</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          A record of all the seniors you've assisted, verified visits, and community reviews.
        </p>
      </div>

      {/* Summary Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-900 rounded-2xl p-6 text-white flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl">
            <Award className="w-8 h-8 text-teal-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Community Impact Certificate</h3>
            <p className="text-xs text-teal-100 mt-0.5">
              Total {completedTasks.length} successfully delivered community visits logged in local records.
            </p>
          </div>
        </div>
      </div>

      {completedTasks.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-slate-500 text-sm">No completed tasks yet. Completed visits will be recorded here.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {completedTasks.map(task => (
            <Card key={task.id} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                    <CategoryIcon category={task.category} size={20} />
                  </div>
                  <div>
                    <span className="font-mono text-xs text-slate-400 font-semibold">{task.id}</span>
                    <h4 className="text-base font-bold text-slate-900">{task.title}</h4>
                  </div>
                </div>
                <Badge status={task.status} size="sm" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block">Assisted Resident:</span>
                  <span className="font-bold text-slate-900">{task.requesterName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Scheduled Date:</span>
                  <span className="font-semibold text-slate-900">{task.preferredDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Locality:</span>
                  <span className="font-semibold text-slate-900">{task.locality}</span>
                </div>
              </div>

              {/* Review received from senior */}
              {task.feedback && (
                <div className="mt-2 p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold mb-1">
                    {[...Array(task.feedback.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                    <span className="text-slate-700 ml-1">Review from {task.feedback.submittedBy}:</span>
                  </div>
                  <p className="text-slate-700 italic">"{task.feedback.comment}"</p>
                </div>
              )}

              <div className="mt-3 flex justify-end">
                <Link
                  to={`/requests/${task.id}`}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900"
                >
                  View Full Request & Timeline →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

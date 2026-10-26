import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card, StatCard } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Star, AlertTriangle, CheckCircle2, MessageSquare, Download, BarChart2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const AdminReportsPage: React.FC = () => {
  const { requests, volunteers } = useData();
  const [activeTab, setActiveTab] = useState<'feedback' | 'cancellations' | 'completion'>('feedback');

  // Completed requests with feedback
  const feedbackRequests = requests.filter(r => r.feedback);
  // Cancelled requests (complaints/issues)
  const cancelledRequests = requests.filter(r => r.status === 'cancelled');

  // Compute average rating
  const avgRating = feedbackRequests.length > 0
    ? (feedbackRequests.reduce((acc, r) => acc + (r.feedback?.rating || 5), 0) / feedbackRequests.length).toFixed(1)
    : '5.0';

  const exportReport = () => {
    alert('Demo Report Export: In production, this compiles a CSV/PDF via Django REST Framework reports endpoint.');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Feedback, Complaints & Reports</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Community satisfaction metrics, cancellation audits, and volunteer delivery logs.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={exportReport}
          icon={<Download className="w-4 h-4" />}
        >
          Export Report (Demo)
        </Button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Average Community Rating"
          value={`${avgRating} / 5.0`}
          subtitle="Based on verified senior reviews"
          icon={<Star className="w-6 h-6" />}
          iconBgColor="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Completed Feedback Submissions"
          value={feedbackRequests.length}
          subtitle="Direct ratings received"
          icon={<MessageSquare className="w-6 h-6" />}
          iconBgColor="bg-teal-50 text-teal-600"
        />
        <StatCard
          title="Cancelled / Flagged Requests"
          value={cancelledRequests.length}
          subtitle="Requester changes or issues"
          icon={<AlertTriangle className="w-6 h-6" />}
          iconBgColor="bg-rose-50 text-rose-600"
        />
      </div>

      {/* Report Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('feedback')}
          className={`pb-3 px-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'feedback'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Verified Senior Feedback ({feedbackRequests.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('cancellations')}
          className={`pb-3 px-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'cancellations'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Cancellation & Issue Audits ({cancelledRequests.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('completion')}
          className={`pb-3 px-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'completion'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Volunteer Performance Summary
        </button>
      </div>

      {/* TAB 1: FEEDBACK LIST */}
      {activeTab === 'feedback' && (
        <div className="space-y-3.5">
          {feedbackRequests.map(req => {
            const fb = req.feedback!;
            return (
              <Card key={req.id} className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-400">{req.id}</span>
                    <h4 className="text-base font-bold text-slate-900">{req.title}</h4>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                    {[...Array(fb.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                    <span className="text-slate-700 ml-1">({fb.rating}/5)</span>
                  </div>
                </div>

                <div className="pt-3">
                  <p className="text-xs sm:text-sm text-slate-800 italic">"{fb.comment}"</p>
                  {fb.serviceQualityTags && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {fb.serviceQualityTags.map(tag => (
                        <span key={tag} className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200">
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-[11px] text-slate-400 mt-3">
                    Submitted by <strong>{fb.submittedBy}</strong> • Assisted by{' '}
                    <strong>{req.assignedVolunteerName || 'Volunteer'}</strong> • {new Date(fb.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* TAB 2: CANCELLATIONS */}
      {activeTab === 'cancellations' && (
        <div className="space-y-3.5">
          {cancelledRequests.map(req => (
            <Card key={req.id} className="p-5 border-rose-200 bg-rose-50/20">
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-rose-100">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-400">{req.id}</span>
                  <h4 className="text-base font-bold text-slate-900">{req.title}</h4>
                </div>
                <Badge status="cancelled" size="sm" />
              </div>
              <div className="pt-2 text-xs text-slate-700">
                <span className="font-bold text-rose-800">Cancellation Reason: </span>
                <span>{req.cancellationReason || 'No specific reason provided.'}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Requested by: {req.requesterName} ({req.locality}) • Updated on {new Date(req.updatedAt).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 3: VOLUNTEER PERFORMANCE TABLE */}
      {activeTab === 'completion' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Volunteer</th>
                <th className="py-3 px-4">Locality</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Completed Visits</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {volunteers.map(vol => (
                <tr key={vol.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-bold text-slate-900">{vol.name}</td>
                  <td className="py-3 px-4 text-slate-600">{vol.locality}</td>
                  <td className="py-3 px-4 font-bold text-amber-600">{vol.rating || 5.0} ★</td>
                  <td className="py-3 px-4 font-bold text-teal-800">{vol.completedTasksCount || 0}</td>
                  <td className="py-3 px-4">
                    <Badge verification={vol.verificationStatus || 'verified'} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

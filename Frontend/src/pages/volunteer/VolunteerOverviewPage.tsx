import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card, StatCard } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CategoryIcon } from '../../components/ui/CategoryIcon';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Star, 
  ArrowRight, 
  Play, 
  MapPin, 
  UserCheck, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const VolunteerOverviewPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { requests, updateRequestStatus } = useData();
  const navigate = useNavigate();

  // Metrics
  const availableRequests = requests.filter(r => r.status === 'pending');
  const myTasks = requests.filter(r => r.assignedVolunteerId === currentUser?.id);
  const acceptedTasks = myTasks.filter(r => r.status === 'accepted' || r.status === 'assigned');
  const inProgressTasks = myTasks.filter(r => r.status === 'in_progress');
  const completedTasks = myTasks.filter(r => r.status === 'completed');

  // Next active task
  const nextTask = inProgressTasks[0] || acceptedTasks[0];

  const handleStartTask = async (taskId: string) => {
    await updateRequestStatus(taskId, 'in_progress', 'Volunteer commenced assistance task');
  };

  const handleCompleteTask = async (taskId: string) => {
    await updateRequestStatus(taskId, 'completed', 'Volunteer completed task successfully');
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Volunteer Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-700 text-teal-200 text-xs font-bold uppercase tracking-wider">
              Volunteer Community Workspace
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-teal-300 font-semibold bg-teal-900/60 px-2.5 py-0.5 rounded-full border border-teal-600">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              Verified Status (Demo)
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Hello, {currentUser?.name}!
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Thank you for being the heart of CareConnect. You have completed{' '}
            <strong className="text-teal-300">{currentUser?.completedTasksCount || 28} community visits</strong> with a{' '}
            <strong className="text-amber-300">{currentUser?.rating || 4.9} ★</strong> satisfaction rating.
          </p>
        </div>

        <Button
          size="xl"
          variant="primary"
          onClick={() => navigate('/volunteer/available')}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold shadow-lg shrink-0 w-full md:w-auto"
          icon={<Calendar className="w-5 h-5 mr-1" />}
        >
          Browse Available Requests ({availableRequests.length})
        </Button>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Open Nearby Requests"
          value={availableRequests.length}
          subtitle="Waiting for volunteer claim"
          icon={<Calendar className="w-6 h-6" />}
          iconBgColor="bg-amber-50 text-amber-700"
          onClick={() => navigate('/volunteer/available')}
        />
        <StatCard
          title="Accepted Tasks"
          value={acceptedTasks.length}
          subtitle="Scheduled upcoming visits"
          icon={<Clock className="w-6 h-6" />}
          iconBgColor="bg-teal-50 text-teal-700"
          onClick={() => navigate('/volunteer/tasks')}
        />
        <StatCard
          title="In Progress"
          value={inProgressTasks.length}
          subtitle="Active assistance underway"
          icon={<Play className="w-6 h-6" />}
          iconBgColor="bg-purple-50 text-purple-700"
          onClick={() => navigate('/volunteer/tasks')}
        />
        <StatCard
          title="Completed by You"
          value={completedTasks.length}
          subtitle="Safely delivered visits"
          icon={<CheckCircle2 className="w-6 h-6" />}
          iconBgColor="bg-emerald-50 text-emerald-700"
          onClick={() => navigate('/volunteer/history')}
        />
      </div>

      {/* Immediate Active Task Highlight */}
      {nextTask && (
        <Card className="border-2 border-teal-500 bg-teal-50/20 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-teal-200">
            <div>
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider bg-teal-100 px-2.5 py-0.5 rounded-full">
                {nextTask.status === 'in_progress' ? '● Assistance In Progress' : 'Next Scheduled Task'}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                {nextTask.title}
              </h3>
            </div>
            <Badge status={nextTask.status} size="lg" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs sm:text-sm">
            <div>
              <span className="text-slate-500 block font-semibold">Senior Resident:</span>
              <span className="font-bold text-slate-900">{nextTask.requesterName}</span>
              <span className="text-slate-500 text-xs block">{nextTask.requesterPhone}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold">Scheduled Window:</span>
              <span className="font-bold text-slate-900">{nextTask.preferredDate} ({nextTask.preferredTime})</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold">Service Address:</span>
              <span className="font-bold text-slate-900">{nextTask.location}</span>
            </div>
          </div>

          {nextTask.additionalInstructions && (
            <div className="mt-3 p-3 rounded-xl bg-white border border-teal-200 text-xs text-slate-700">
              <strong>Senior’s Note:</strong> {nextTask.additionalInstructions}
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-teal-200/60">
            <Link
              to={`/requests/${nextTask.id}`}
              className="text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              <span>View Milestone Tracking</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2">
              {nextTask.status === 'accepted' && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleStartTask(nextTask.id)}
                  icon={<Play className="w-4 h-4 fill-white" />}
                >
                  Start Assistance
                </Button>
              )}
              {nextTask.status === 'in_progress' && (
                <Button
                  variant="success"
                  size="md"
                  onClick={() => handleCompleteTask(nextTask.id)}
                  icon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Mark as Completed
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Available Requests Nearby Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              Open Requests in Your Service Area
            </h3>
            <p className="text-xs text-slate-500">
              Showing pending requests in {currentUser?.locality || 'Downtown Maple District'} (Privacy-protected general localities)
            </p>
          </div>
          <Link
            to="/volunteer/available"
            className="text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            <span>View All ({availableRequests.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {availableRequests.length === 0 ? (
          <Card className="text-center py-10">
            <p className="text-slate-500 text-sm">No new pending requests right now. Great job keeping the community supported!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableRequests.slice(0, 4).map(req => (
              <Card key={req.id} className="p-5 flex flex-col justify-between hover:border-teal-300 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
                      <CategoryIcon category={req.category} size={20} />
                    </div>
                    <Badge status={req.status} />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{req.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{req.description}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700 block">{req.preferredDate}</span>
                    <span>{req.locality}</span>
                  </div>

                  <Link to={`/requests/${req.id}`}>
                    <Button variant="primary" size="sm">
                      Review & Accept
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

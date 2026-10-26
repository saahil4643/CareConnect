import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CategoryIcon } from '../../components/ui/CategoryIcon';
import { EmptyState } from '../../components/ui/EmptyState';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MapPin, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { RequestStatus } from '../../types';

export const MyTasksPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { requests, updateRequestStatus } = useData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'all' | 'accepted' | 'in_progress' | 'completed'>('accepted');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filter tasks claimed by or assigned to this volunteer
  const myTasks = requests.filter(r => r.assignedVolunteerId === currentUser?.id);

  const filteredTasks = myTasks.filter(task => {
    if (activeTab === 'all') return true;
    if (activeTab === 'accepted') return task.status === 'accepted' || task.status === 'assigned';
    return task.status === activeTab;
  });

  const handleStartTask = async (taskId: string) => {
    setUpdatingId(taskId);
    try {
      await updateRequestStatus(taskId, 'in_progress', 'Volunteer arrived and started assistance.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    setUpdatingId(taskId);
    try {
      await updateRequestStatus(taskId, 'completed', 'Volunteer marked task safely completed.');
    } finally {
      setUpdatingId(null);
    }
  };

  const tabs: { key: typeof activeTab; label: string; count: number }[] = [
    { key: 'accepted', label: 'Accepted & Upcoming', count: myTasks.filter(t => t.status === 'accepted' || t.status === 'assigned').length },
    { key: 'in_progress', label: 'In Progress', count: myTasks.filter(t => t.status === 'in_progress').length },
    { key: 'completed', label: 'Completed', count: myTasks.filter(t => t.status === 'completed').length },
    { key: 'all', label: 'All Claimed Tasks', count: myTasks.length },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900">My Volunteer Tasks</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your committed visits, access senior contact information, and update task progress.
          </p>
        </div>
        <Link to="/volunteer/available">
          <Button variant="outline" size="md">
            + Claim More Requests
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 px-3.5 text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                activeTab === tab.key ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title="No Tasks in This Tab"
          description="You don't have any tasks matching this state."
          actionLabel="Browse Available Nearby Requests"
          onAction={() => navigate('/volunteer/available')}
        />
      ) : (
        <div className="space-y-4">
          {filteredTasks.map(task => {
            const isAccepted = task.status === 'accepted' || task.status === 'assigned';
            const isInProgress = task.status === 'in_progress';
            const isCompleted = task.status === 'completed';

            return (
              <Card
                key={task.id}
                className={`p-6 border transition-all ${
                  isInProgress ? 'border-purple-300 bg-purple-50/20' : 'border-slate-200/90'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-teal-50 text-teal-700 shrink-0">
                      <CategoryIcon category={task.category} size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {task.id}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">{task.title}</h3>
                        <Badge status={task.status} />
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{task.description}</p>
                    </div>
                  </div>

                  {/* Quick Action Button for Status Progression */}
                  <div className="flex items-center gap-2 self-start lg:self-auto">
                    {isAccepted && (
                      <Button
                        variant="primary"
                        size="md"
                        isLoading={updatingId === task.id}
                        onClick={() => handleStartTask(task.id)}
                        icon={<Play className="w-4 h-4 fill-white" />}
                      >
                        Start Assistance
                      </Button>
                    )}

                    {isInProgress && (
                      <Button
                        variant="success"
                        size="md"
                        isLoading={updatingId === task.id}
                        onClick={() => handleCompleteTask(task.id)}
                        icon={<CheckCircle2 className="w-4 h-4" />}
                      >
                        Mark Completed
                      </Button>
                    )}

                    <Link to={`/requests/${task.id}`}>
                      <Button variant="secondary" size="md">
                        Tracking & Details
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Senior Resident Contact & Unlocked Address (safe because claimed) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                  <div>
                    <span className="text-slate-500 block font-semibold">Assisting Resident:</span>
                    <span className="font-bold text-slate-900 text-sm block mt-0.5">{task.requesterName}</span>
                    <a
                      href={`tel:${task.requesterPhone}`}
                      className="text-teal-700 font-bold hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{task.requesterPhone}</span>
                    </a>
                  </div>

                  <div>
                    <span className="text-slate-500 block font-semibold">Preferred Schedule:</span>
                    <span className="font-bold text-slate-900 block mt-0.5">{task.preferredDate}</span>
                    <span className="text-slate-600">{task.preferredTime}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block font-semibold">Service Residence Address:</span>
                    <span className="font-bold text-slate-900 block mt-0.5">{task.location}</span>
                    <span className="text-slate-500">{task.locality}</span>
                  </div>
                </div>

                {task.additionalInstructions && (
                  <div className="mt-3 text-xs text-slate-700 bg-teal-50/60 p-2.5 rounded-lg border border-teal-100">
                    <span className="font-bold text-teal-900">Access Instructions: </span>
                    {task.additionalInstructions}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

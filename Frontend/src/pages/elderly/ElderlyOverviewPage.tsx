import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, StatCard } from '../../components/ui/Card';
import { CategoryIcon } from '../../components/ui/CategoryIcon';
import { 
  PlusCircle, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Phone, 
  ShieldCheck, 
  ArrowRight,
  ShoppingBag,
  Pill,
  CalendarCheck,
  Car,
  HeartHandshake
} from 'lucide-react';

export const ElderlyOverviewPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { requests } = useData();
  const navigate = useNavigate();

  // Filter requests belonging to this elderly user
  const userRequests = requests.filter(r => r.requesterId === currentUser?.id || r.forElderlyName === currentUser?.name);

  const pendingCount = userRequests.filter(r => r.status === 'pending').length;
  const activeCount = userRequests.filter(r => r.status === 'assigned' || r.status === 'accepted' || r.status === 'in_progress').length;
  const completedCount = userRequests.filter(r => r.status === 'completed').length;

  // Next upcoming assistance
  const nextAssistance = userRequests
    .filter(r => r.status === 'accepted' || r.status === 'in_progress' || r.status === 'assigned')
    .sort((a, b) => new Date(a.preferredDate).getTime() - new Date(b.preferredDate).getTime())[0];

  const quickActions = [
    { label: 'Request Grocery Delivery', category: 'grocery', icon: <ShoppingBag className="w-6 h-6 text-teal-700" /> },
    { label: 'Collect Medicines', category: 'medicine', icon: <Pill className="w-6 h-6 text-teal-700" /> },
    { label: 'Medical Appointment', category: 'appointment', icon: <CalendarCheck className="w-6 h-6 text-teal-700" /> },
    { label: 'Request Transportation', category: 'transport', icon: <Car className="w-6 h-6 text-teal-700" /> },
    { label: 'Other Personal Assistance', category: 'other', icon: <HeartHandshake className="w-6 h-6 text-teal-700" /> },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Top Welcome Banner with Large Request Button */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="px-3 py-1 rounded-full bg-teal-700 text-teal-200 text-xs font-bold uppercase tracking-wider">
            Senior Assistance Dashboard
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Hello, {currentUser?.name}!
          </h2>
          <p className="text-sm sm:text-base text-teal-100 leading-relaxed">
            Need someone to run an errand, pick up medicine, or accompany you to an appointment? 
            Your community volunteers are ready to help.
          </p>
        </div>

        {/* High-Contrast Large Request Button for Elderly Users */}
        <Button
          size="xl"
          variant="primary"
          onClick={() => navigate('/elderly/request-help')}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold shadow-lg shadow-emerald-950/20 w-full md:w-auto shrink-0"
          icon={<PlusCircle className="w-6 h-6 mr-1" />}
        >
          Request Help Now
        </Button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Active Requests"
          value={activeCount}
          subtitle="Volunteer assigned or in progress"
          icon={<Clock className="w-6 h-6" />}
          iconBgColor="bg-teal-50 text-teal-700"
          onClick={() => navigate('/elderly/requests')}
        />
        <StatCard
          title="Pending Requests"
          value={pendingCount}
          subtitle="Awaiting volunteer match"
          icon={<Calendar className="w-6 h-6" />}
          iconBgColor="bg-amber-50 text-amber-700"
          onClick={() => navigate('/elderly/requests')}
        />
        <StatCard
          title="Completed Assistance"
          value={completedCount}
          subtitle="Safely assisted visits"
          icon={<CheckCircle2 className="w-6 h-6" />}
          iconBgColor="bg-emerald-50 text-emerald-700"
          onClick={() => navigate('/elderly/requests')}
        />
      </div>

      {/* Next Scheduled Assistance Feature Card */}
      {nextAssistance && (
        <Card className="border-2 border-teal-500/40 bg-teal-50/30 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-teal-200/60">
            <div>
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider bg-teal-100 px-2.5 py-0.5 rounded-full">
                Next Scheduled Assistance
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                {nextAssistance.title}
              </h3>
            </div>
            <Badge status={nextAssistance.status} size="lg" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs sm:text-sm">
            <div>
              <span className="text-slate-500 block font-semibold">Date & Time:</span>
              <span className="font-bold text-slate-900">{nextAssistance.preferredDate} ({nextAssistance.preferredTime})</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold">Location:</span>
              <span className="font-bold text-slate-900">{nextAssistance.location}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold">Assigned Volunteer:</span>
              <span className="font-bold text-teal-800">{nextAssistance.assignedVolunteerName || 'Matching Volunteer...'}</span>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <Link
              to={`/requests/${nextAssistance.id}`}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-900"
            >
              <span>View Milestone Tracking & Contact Volunteer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Card>
      )}

      {/* Quick Action Large Buttons */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-black text-slate-900">
            Quick Assistance Categories
          </h3>
          <span className="text-xs text-slate-500">Tap to start a quick request</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {quickActions.map(action => (
            <button
              key={action.category}
              type="button"
              onClick={() => navigate('/elderly/request-help')}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-400 hover:bg-teal-50/40 shadow-xs transition-all text-left flex flex-col justify-between group active:scale-[0.98]"
            >
              <div className="p-3 rounded-xl bg-teal-50 w-fit mb-4 group-hover:scale-110 transition-transform">
                {action.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                  {action.label}
                </p>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <span>Start Request</span>
                  <ArrowRight className="w-3 h-3 text-teal-600" />
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Requests List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-black text-slate-900">
            Recent Assistance Requests
          </h3>
          <Link
            to="/elderly/requests"
            className="text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            <span>View All ({userRequests.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {userRequests.length === 0 ? (
          <Card className="text-center py-10">
            <p className="text-slate-500 text-sm">No assistance requests logged yet.</p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => navigate('/elderly/request-help')}
            >
              Submit Your First Request
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {userRequests.slice(0, 5).map(req => (
              <div
                key={req.id}
                onClick={() => navigate(`/requests/${req.id}`)}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 hover:border-teal-300 hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 shrink-0 mt-0.5">
                    <CategoryIcon category={req.category} size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-500">{req.id}</span>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">{req.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Scheduled for: <strong>{req.preferredDate}</strong> • {req.preferredTime} • {req.locality}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <Badge status={req.status} />
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assigned Volunteer Feature Card */}
      {nextAssistance?.assignedVolunteerId && (
        <Card className="bg-white border-slate-200">
          <div className="flex items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={nextAssistance.assignedVolunteerAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'}
                alt={nextAssistance.assignedVolunteerName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500 shadow-xs"
              />
              <div>
                <span className="text-xs font-semibold text-slate-500">Your Assigned Neighbor Helper</span>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>{nextAssistance.assignedVolunteerName}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    <ShieldCheck className="w-3 h-3 text-teal-600" />
                    Verified
                  </span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{nextAssistance.assignedVolunteerPhone || '+1 (555) 456-7890'}</span>
                </p>
              </div>
            </div>

            <Link to="/elderly/volunteer">
              <Button variant="secondary" size="sm">
                Volunteer Info
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
};

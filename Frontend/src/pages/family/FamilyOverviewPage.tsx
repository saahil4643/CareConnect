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
  CheckCircle2, 
  Users, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Heart,
  Phone
} from 'lucide-react';

export const FamilyOverviewPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { requests, notifications } = useData();
  const navigate = useNavigate();

  // Requests submitted by this family member or for their elderly relative
  const familyRequests = requests.filter(
    r => r.requesterId === currentUser?.id || r.requesterRole === 'family'
  );

  const pendingCount = familyRequests.filter(r => r.status === 'pending').length;
  const inProgressCount = familyRequests.filter(r => r.status === 'in_progress' || r.status === 'accepted' || r.status === 'assigned').length;
  const completedCount = familyRequests.filter(r => r.status === 'completed').length;

  const nextTask = familyRequests
    .filter(r => r.status === 'accepted' || r.status === 'in_progress' || r.status === 'assigned')
    .sort((a, b) => new Date(a.preferredDate).getTime() - new Date(b.preferredDate).getTime())[0];

  return (
    <div className="space-y-8 pb-10">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800 text-teal-200 text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-teal-400" />
            <span>Family Caregiver Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome, {currentUser?.name}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Coordinating community support for your loved one:{' '}
            <strong className="text-teal-300">{currentUser?.elderlyName || 'Eleanor Vance'} ({currentUser?.relationshipToElderly || 'Parent'})</strong>.
          </p>
        </div>

        <Button
          size="xl"
          variant="primary"
          onClick={() => navigate('/family/request-help')}
          className="bg-teal-500 hover:bg-teal-600 text-white font-extrabold shadow-lg shrink-0 w-full md:w-auto"
          icon={<PlusCircle className="w-6 h-6 mr-1" />}
        >
          Request for Relative
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Active Assistance Visits"
          value={inProgressCount}
          subtitle="Assigned or in progress"
          icon={<Clock className="w-6 h-6" />}
          iconBgColor="bg-teal-50 text-teal-700"
          onClick={() => navigate('/family/requests')}
        />
        <StatCard
          title="Pending Volunteer Matches"
          value={pendingCount}
          subtitle="Awaiting volunteer pickup"
          icon={<Calendar className="w-6 h-6" />}
          iconBgColor="bg-amber-50 text-amber-700"
          onClick={() => navigate('/family/requests')}
        />
        <StatCard
          title="Completed Relatives Visits"
          value={completedCount}
          subtitle="Safely assisted errands"
          icon={<CheckCircle2 className="w-6 h-6" />}
          iconBgColor="bg-emerald-50 text-emerald-700"
          onClick={() => navigate('/family/requests')}
        />
      </div>

      {/* Distinction Banner: Relative vs Family profile */}
      <Card className="bg-slate-50 border-slate-200/90 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-teal-100 text-teal-800 shrink-0">
              <Heart className="w-6 h-6 text-teal-700" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800">Assisted Relative Profile</span>
              <h4 className="text-base font-bold text-slate-900">
                {currentUser?.elderlyName || 'Eleanor Vance'} ({currentUser?.relationshipToElderly || 'Mother'})
              </h4>
              <p className="text-xs text-slate-500">
                Residence: {currentUser?.elderlyAddress || '742 Evergreen Terrace, Apt 3B, Downtown Maple District'}
              </p>
            </div>
          </div>

          <Link to="/family/profile">
            <Button variant="secondary" size="sm">
              Manage Relative Link
            </Button>
          </Link>
        </div>
      </Card>

      {/* Next Scheduled Assistance */}
      {nextTask && (
        <Card className="border-2 border-teal-500/40 bg-teal-50/20 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-teal-200/60">
            <div>
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider bg-teal-100 px-2.5 py-0.5 rounded-full">
                Upcoming Relative Assistance
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                {nextTask.title}
              </h3>
            </div>
            <Badge status={nextTask.status} size="lg" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs sm:text-sm">
            <div>
              <span className="text-slate-500 block font-semibold">Date & Window:</span>
              <span className="font-bold text-slate-900">{nextTask.preferredDate} ({nextTask.preferredTime})</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold">Assigned Volunteer:</span>
              <span className="font-bold text-teal-800">{nextTask.assignedVolunteerName || 'Matching Volunteer...'}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold">Location:</span>
              <span className="font-bold text-slate-900">{nextTask.location}</span>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <Link
              to={`/requests/${nextTask.id}`}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-900"
            >
              <span>Track Assistance Progress</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Card>
      )}

      {/* Recent Requests Table/List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-black text-slate-900">
            Requests Logged for {currentUser?.elderlyName || 'Family Relative'}
          </h3>
          <Link
            to="/family/requests"
            className="text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            <span>View All ({familyRequests.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {familyRequests.length === 0 ? (
          <Card className="text-center py-10">
            <p className="text-slate-500 text-sm">No assistance requests logged yet for your family relative.</p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => navigate('/family/request-help')}
            >
              Request Help for Loved One
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {familyRequests.slice(0, 5).map(req => (
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
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {req.id}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">{req.title}</h4>
                      <Badge status={req.status} />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Scheduled: <strong>{req.preferredDate}</strong> ({req.preferredTime}) • Location: {req.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <Button variant="outline" size="sm">
                    View & Track
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

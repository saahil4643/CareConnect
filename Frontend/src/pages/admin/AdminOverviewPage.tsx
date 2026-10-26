import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card, StatCard } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CategoryIcon } from '../../components/ui/CategoryIcon';
import { ASSISTANCE_CATEGORIES } from '../../data/mockData';
import {
  Users,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Calendar
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';

export const AdminOverviewPage: React.FC = () => {
  const { requests, allUsers, volunteers } = useData();
  const navigate = useNavigate();

  // Metrics
  const totalUsers = allUsers.length;
  const activeVolunteersCount = volunteers.length;
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const assignedRequests = requests.filter(r => r.status === 'assigned' || r.status === 'accepted');
  const inProgressRequests = requests.filter(r => r.status === 'in_progress');
  const completedRequests = requests.filter(r => r.status === 'completed');

  // Chart 1: Requests by Category
  const categoryData = ASSISTANCE_CATEGORIES.map(cat => ({
    name: cat.label.split(' ')[0], // short name
    fullName: cat.label,
    count: requests.filter(r => r.category === cat.id).length,
  }));

  // Chart 2: Request Status Distribution
  const statusColors: Record<string, string> = {
    pending: '#f59e0b',
    assigned: '#38bdf8',
    accepted: '#6366f1',
    in_progress: '#a855f7',
    completed: '#10b981',
    cancelled: '#f43f5e',
  };

  const statusDistribution = [
    { name: 'Pending', value: pendingRequests.length, color: statusColors.pending },
    { name: 'Assigned', value: requests.filter(r => r.status === 'assigned').length, color: statusColors.assigned },
    { name: 'Accepted', value: requests.filter(r => r.status === 'accepted').length, color: statusColors.accepted },
    { name: 'In Progress', value: inProgressRequests.length, color: statusColors.in_progress },
    { name: 'Completed', value: completedRequests.length, color: statusColors.completed },
    { name: 'Cancelled', value: requests.filter(r => r.status === 'cancelled').length, color: statusColors.cancelled },
  ].filter(item => item.value > 0);

  // Chart 3: Assistance Activity Over Time (Demo Monthly data)
  const activityTrendData = [
    { month: 'Jun', requests: 12, completed: 10 },
    { month: 'Jul', requests: 18, completed: 16 },
    { month: 'Aug', requests: 24, completed: 22 },
    { month: 'Sep', requests: 31, completed: 29 },
    { month: 'Oct', requests: 38, completed: 33 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
            Operations & Volunteer Coordination Hub
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            System Administrator Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time oversight of community assistance requests, volunteer deployment, and service metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/admin/requests')}
          >
            Manage Requests
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/admin/volunteers')}
          >
            Volunteers Network
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={<Users className="w-5 h-5" />}
          iconBgColor="bg-slate-100 text-slate-700"
          onClick={() => navigate('/admin/users')}
        />
        <StatCard
          title="Active Volunteers"
          value={activeVolunteersCount}
          icon={<ShieldCheck className="w-5 h-5" />}
          iconBgColor="bg-teal-50 text-teal-700"
          onClick={() => navigate('/admin/volunteers')}
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequests.length}
          icon={<Clock className="w-5 h-5" />}
          iconBgColor="bg-amber-50 text-amber-700"
          onClick={() => navigate('/admin/requests')}
        />
        <StatCard
          title="Assigned / Accepted"
          value={assignedRequests.length}
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBgColor="bg-sky-50 text-sky-700"
          onClick={() => navigate('/admin/requests')}
        />
        <StatCard
          title="In Progress"
          value={inProgressRequests.length}
          icon={<Play className="w-5 h-5" />}
          iconBgColor="bg-purple-50 text-purple-700"
          onClick={() => navigate('/admin/requests')}
        />
        <StatCard
          title="Completed"
          value={completedRequests.length}
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBgColor="bg-emerald-50 text-emerald-700"
          onClick={() => navigate('/admin/requests')}
        />
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Category Distribution (7 cols) */}
        <Card className="lg:col-span-7 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Requests by Assistance Category</h3>
              <p className="text-xs text-slate-400">Distribution across community errand types (Demo Data)</p>
            </div>
            <BarChart3 className="w-5 h-5 text-teal-600" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: unknown) => [String(val), 'Requests']}
                  labelFormatter={(label) => {
                    const match = categoryData.find(c => c.name === label);
                    return match ? match.fullName : String(label);
                  }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="count" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Status Distribution Pie (5 cols) */}
        <Card className="lg:col-span-5 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Request Status Distribution</h3>
              <p className="text-xs text-slate-400">Active vs completed vs pending</p>
            </div>
            <TrendingUp className="w-5 h-5 text-teal-600" />
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: unknown) => [String(val), 'Requests']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 3: Activity Over Time Trend (Full width) */}
        <Card className="lg:col-span-12 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Assistance Activity Over Time</h3>
              <p className="text-xs text-slate-400">Monthly total requested vs completed visits (Illustrative trend)</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              ↑ 18% Monthly Growth
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                <Area type="monotone" dataKey="requests" stroke="#0d9488" fillOpacity={1} fill="url(#colorReq)" name="Submitted" />
                <Area type="monotone" dataKey="completed" stroke="#10b981" fillOpacity={1} fill="url(#colorComp)" name="Completed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Urgent Pending Requests requiring Assignment */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Pending Requests Requiring Volunteer Assignment
            </h3>
            <p className="text-xs text-slate-500">Unmatched requests awaiting coordinator action</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/requests')}
          >
            Open All Requests
          </Button>
        </div>

        {pendingRequests.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-slate-500 text-sm">No requests are currently pending assignment. All caught up!</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map(req => (
              <div
                key={req.id}
                onClick={() => navigate(`/requests/${req.id}`)}
                className="bg-white rounded-2xl border border-amber-200/80 p-4 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 shrink-0 mt-0.5">
                    <CategoryIcon category={req.category} size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">{req.id}</span>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">{req.title}</h4>
                      <Badge status={req.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Senior: <strong>{req.requesterName}</strong> • Locality: {req.locality} • Scheduled: {req.preferredDate} ({req.preferredTime})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Button variant="primary" size="sm">
                    Assign Volunteer
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

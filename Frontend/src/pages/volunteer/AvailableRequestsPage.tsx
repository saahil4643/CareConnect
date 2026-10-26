import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CategoryIcon } from '../../components/ui/CategoryIcon';
import { EmptyState } from '../../components/ui/EmptyState';
import { ASSISTANCE_CATEGORIES } from '../../data/mockData';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Navigation
} from 'lucide-react';

export const AvailableRequestsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { requests, acceptRequest } = useData();
  const navigate = useNavigate();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [localityFilter, setLocalityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Available requests are open (pending)
  const availableRequests = requests.filter(r => r.status === 'pending');

  // Distinct localities
  const localities = Array.from(new Set(availableRequests.map(r => r.locality)));

  const filtered = availableRequests.filter(req => {
    const matchesCategory = categoryFilter === 'all' || req.category === categoryFilter;
    const matchesLocality = localityFilter === 'all' || req.locality === localityFilter;
    const matchesSearch =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.locality.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesLocality && matchesSearch;
  });

  const handleAccept = async (requestId: string) => {
    setError(null);
    setAcceptingId(requestId);
    try {
      await acceptRequest(requestId);
      navigate('/volunteer/tasks');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to claim request.');
      }
    } finally {
      setAcceptingId(null);
    }
  };

  // Illustrative distance helper based on mock data locality
  const getDemoDistance = (reqLocality: string) => {
    if (reqLocality === currentUser?.locality) return '0.8 miles away';
    if (reqLocality.includes('Maple')) return '1.4 miles away';
    if (reqLocality.includes('North')) return '3.2 miles away';
    return '2.1 miles away';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-black text-slate-900">Available Assistance Requests</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Choose requests in your neighborhood that fit your schedule.
        </p>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-teal-900 text-xs flex items-center gap-2.5">
        <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0" />
        <span>
          <strong>Senior Privacy Protection:</strong> General neighborhood localities and distances are shown. 
          Exact residential apartment/street addresses and senior direct phone contacts are unlocked immediately once you claim the task.
        </span>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search available tasks by keywords or neighborhood..."
              className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-teal-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {ASSISTANCE_CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>

            <select
              value={localityFilter}
              onChange={e => setLocalityFilter(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-teal-500 focus:outline-none"
            >
              <option value="all">All Localities</option>
              {localities.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Requests Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No Requests Currently Available"
          description={
            searchQuery || categoryFilter !== 'all' || localityFilter !== 'all'
              ? 'No open requests match your chosen filters.'
              : 'All nearby assistance requests are currently claimed by volunteers.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(req => {
            const distance = getDemoDistance(req.locality);

            return (
              <Card
                key={req.id}
                className="p-5 flex flex-col justify-between hover:border-teal-400 hover:shadow-md transition-all space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
                        <CategoryIcon category={req.category} size={20} />
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold text-slate-500">{req.id}</span>
                        <h3 className="text-base font-bold text-slate-900">{req.title}</h3>
                      </div>
                    </div>
                    <Badge category={req.category} size="sm" />
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                    {req.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="font-semibold">{req.preferredDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{req.preferredTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{req.locality}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-teal-800 font-bold">
                      <Navigation className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{distance}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/requests/${req.id}`)}
                    icon={<Eye className="w-4 h-4" />}
                  >
                    View Details
                  </Button>

                  <Button
                    variant="primary"
                    size="md"
                    isLoading={acceptingId === req.id}
                    onClick={() => handleAccept(req.id)}
                    icon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Accept Request
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

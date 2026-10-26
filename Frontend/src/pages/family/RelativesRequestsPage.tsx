import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { CategoryIcon } from '../../components/ui/CategoryIcon';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { Search, PlusCircle, Calendar, ArrowRight, XCircle } from 'lucide-react';

export const RelativesRequestsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { requests, cancelRequest } = useData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCancelId, setSelectedCancelId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const familyRequests = requests.filter(
    r => r.requesterId === currentUser?.id || r.requesterRole === 'family'
  );

  const filteredRequests = familyRequests.filter(req => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.forElderlyName && req.forElderlyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (req.assignedVolunteerName && req.assignedVolunteerName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleConfirmCancel = async () => {
    if (!selectedCancelId) return;
    setIsCancelling(true);
    try {
      await cancelRequest(selectedCancelId, 'Cancelled by family coordinator');
      setSelectedCancelId(null);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Assistance Requests for {currentUser?.elderlyName || 'Elderly Relative'}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor progress, confirm volunteer visits, and view completion details.
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/family/request-help')}
          icon={<PlusCircle className="w-5 h-5" />}
        >
          Request for Loved One
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by title, ID, volunteer, or location..."
            className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['all', 'pending', 'assigned', 'in_progress', 'completed', 'cancelled'].map(st => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <EmptyState
          title="No Requests Found"
          description={
            searchQuery || statusFilter !== 'all'
              ? 'No requests match your current filters.'
              : 'You have not submitted any assistance requests for your relative yet.'
          }
          actionLabel="Create a Request"
          onAction={() => navigate('/family/request-help')}
        />
      ) : (
        <div className="space-y-3.5">
          {filteredRequests.map(req => {
            const canCancel = req.status !== 'completed' && req.status !== 'cancelled';
            return (
              <Card
                key={req.id}
                className="hover:border-teal-300 transition-all p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-2xl bg-teal-50 text-teal-700 shrink-0 mt-0.5">
                    <CategoryIcon category={req.category} size={24} />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {req.id}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{req.title}</h3>
                      <Badge status={req.status} />
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{req.description}</p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        {req.preferredDate} ({req.preferredTime})
                      </span>
                      <span>•</span>
                      <span>Location: {req.location}</span>
                      {req.assignedVolunteerName && (
                        <>
                          <span>•</span>
                          <span className="text-teal-800 font-semibold">
                            Volunteer: {req.assignedVolunteerName}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  {canCancel && (
                    <button
                      type="button"
                      onClick={() => setSelectedCancelId(req.id)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  )}

                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => navigate(`/requests/${req.id}`)}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Track Progress
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <ConfirmationModal
        isOpen={!!selectedCancelId}
        onClose={() => setSelectedCancelId(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel This Request?"
        message="Are you sure you want to cancel this assistance request on behalf of your family relative?"
        confirmLabel="Yes, Cancel"
        isDestructive
        isLoading={isCancelling}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { CategoryIcon } from '../../components/ui/CategoryIcon';
import { AssistanceRequest, RequestStatus, User } from '../../types';
import { 
  Search, 
  Filter, 
  UserCheck, 
  MapPin, 
  Calendar, 
  Eye, 
  XCircle, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Star
} from 'lucide-react';

export const AdminRequestsPage: React.FC = () => {
  const { requests, volunteers, assignVolunteer, updateRequestStatus, cancelRequest } = useData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Assignment Modal
  const [assigningRequest, setAssigningRequest] = useState<AssistanceRequest | null>(null);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Status Change Modal
  const [statusChangeReq, setStatusChangeReq] = useState<AssistanceRequest | null>(null);
  const [newStatus, setNewStatus] = useState<RequestStatus>('in_progress');
  const [statusNote, setStatusNote] = useState('');

  // Cancel Modal
  const [cancelTargetReq, setCancelTargetReq] = useState<AssistanceRequest | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const filteredRequests = requests.filter(req => {
    const matchesSearch =
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.assignedVolunteerName && req.assignedVolunteerName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || req.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleOpenAssignModal = (req: AssistanceRequest) => {
    setAssigningRequest(req);
    setSelectedVolunteerId(req.assignedVolunteerId || (volunteers[0]?.id || ''));
  };

  const handleConfirmAssignment = async () => {
    if (!assigningRequest || !selectedVolunteerId) return;
    setIsAssigning(true);
    try {
      await assignVolunteer(assigningRequest.id, selectedVolunteerId);
      setAssigningRequest(null);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!statusChangeReq) return;
    try {
      await updateRequestStatus(statusChangeReq.id, newStatus, statusNote || undefined);
      setStatusChangeReq(null);
      setStatusNote('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelTargetReq) return;
    setIsCancelling(true);
    try {
      await cancelRequest(cancelTargetReq.id, 'Cancelled by administrator oversight');
      setCancelTargetReq(null);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Assistance Requests Coordination</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Search, assign volunteers, update status, and manage the full lifecycle of community requests.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by ID, title, senior name, volunteer, or locality..."
            className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-teal-500 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="accepted">Accepted</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Request</th>
                <th className="py-3.5 px-4">Requester</th>
                <th className="py-3.5 px-4">Locality</th>
                <th className="py-3.5 px-4">Schedule</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Assigned Volunteer</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No assistance requests match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRequests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700 shrink-0">
                          <CategoryIcon category={req.category} size={16} />
                        </div>
                        <div>
                          <span className="font-mono font-bold text-slate-500 block text-[11px]">{req.id}</span>
                          <span className="font-bold text-slate-900 block max-w-xs truncate">{req.title}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 block">{req.requesterName}</span>
                      <span className="text-[11px] text-slate-500 capitalize">{req.requesterRole}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-700">{req.locality}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-900 block">{req.preferredDate}</span>
                      <span className="text-[11px] text-slate-500">{req.preferredTime}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge status={req.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4">
                      {req.assignedVolunteerName ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-teal-800">{req.assignedVolunteerName}</span>
                        </div>
                      ) : (
                        <span className="text-amber-600 font-semibold text-xs bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          Unassigned
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/requests/${req.id}`)}
                          title="View Details & Tracking"
                        >
                          <Eye className="w-4 h-4 text-slate-600" />
                        </Button>

                        {req.status !== 'completed' && req.status !== 'cancelled' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenAssignModal(req)}
                            title="Assign or change volunteer"
                          >
                            <UserCheck className="w-4 h-4 text-teal-700" />
                          </Button>
                        )}

                        {req.status !== 'completed' && req.status !== 'cancelled' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCancelTargetReq(req)}
                            title="Cancel Request"
                            className="text-rose-600 hover:bg-rose-50"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Volunteer Assignment Modal */}
      {assigningRequest && (
        <Modal
          isOpen={!!assigningRequest}
          onClose={() => setAssigningRequest(null)}
          title="Assign Community Volunteer"
          description={`Select an eligible volunteer for ${assigningRequest.title} (${assigningRequest.id}) in ${assigningRequest.locality}.`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {volunteers.map(vol => {
                const isSelected = selectedVolunteerId === vol.id;
                const isMatchingLocality = vol.locality.toLowerCase().includes(assigningRequest.locality.toLowerCase());

                return (
                  <div
                    key={vol.id}
                    onClick={() => setSelectedVolunteerId(vol.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-teal-50 border-teal-600 ring-2 ring-teal-500/20'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={vol.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'}
                        alt={vol.name}
                        className="w-10 h-10 rounded-xl object-cover border"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{vol.name}</h4>
                          {isMatchingLocality && (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              Matches Locality
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          {vol.locality} • Rating: {vol.rating || 4.9} ★ • Completed: {vol.completedTasksCount || 0} tasks
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => setSelectedVolunteerId(vol.id)}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button variant="secondary" onClick={() => setAssigningRequest(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmAssignment}
                isLoading={isAssigning}
              >
                Confirm Volunteer Assignment
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Cancellation Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!cancelTargetReq}
        onClose={() => setCancelTargetReq(null)}
        onConfirm={handleConfirmCancel}
        title="Admin: Cancel Assistance Request?"
        message={`Are you sure you want to cancel request ${cancelTargetReq?.id}? Requester and any assigned volunteer will be notified.`}
        confirmLabel="Yes, Cancel Request"
        isDestructive
        isLoading={isCancelling}
      />
    </div>
  );
};

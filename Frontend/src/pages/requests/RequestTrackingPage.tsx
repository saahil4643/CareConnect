import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { CategoryIcon } from '../../components/ui/CategoryIcon';
import { FeedbackModal } from '../../components/feedback/FeedbackModal';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { RequestStatus } from '../../types';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Phone, 
  UserCheck, 
  Calendar, 
  AlertCircle, 
  Star, 
  CheckCircle2, 
  ShieldCheck,
  XCircle,
  Play
} from 'lucide-react';

export const RequestTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { requests, cancelRequest, updateRequestStatus, acceptRequest } = useData();
  const { currentUser } = useAuth();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of plans');
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const request = requests.find(r => r.id === id);

  if (!request) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-bold text-slate-800">Assistance Request Not Found</h3>
        <p className="text-sm text-slate-500 mt-2">The requested ID "{id}" does not exist in local demo records.</p>
        <Button variant="primary" className="mt-6" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  // 5 Canonical Milestones
  const milestones: { status: RequestStatus; label: string; desc: string }[] = [
    { status: 'pending', label: '1. Request Submitted', desc: 'Logged and awaiting volunteer review' },
    { status: 'assigned', label: '2. Request Reviewed & Assigned', desc: 'Matched with community volunteer' },
    { status: 'accepted', label: '3. Volunteer Confirmed', desc: 'Volunteer committed to scheduled window' },
    { status: 'in_progress', label: '4. Assistance In Progress', desc: 'Volunteer currently assisting senior' },
    { status: 'completed', label: '5. Assistance Completed', desc: 'Task safely and successfully delivered' },
  ];

  // Helper to determine milestone state: 'done', 'current', 'future', 'cancelled'
  const getMilestoneState = (milestoneStatus: RequestStatus) => {
    if (request.status === 'cancelled') {
      return milestoneStatus === 'pending' ? 'done' : 'cancelled';
    }

    const order: RequestStatus[] = ['pending', 'assigned', 'accepted', 'in_progress', 'completed'];
    const currentIndex = order.indexOf(request.status);
    const targetIndex = order.indexOf(milestoneStatus);

    if (targetIndex < currentIndex) return 'done';
    if (targetIndex === currentIndex) return 'current';
    return 'future';
  };

  const handleCancel = async () => {
    setIsUpdating(true);
    try {
      await cancelRequest(request.id, cancelReason);
      setIsCancelModalOpen(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleVolunteerAccept = async () => {
    setIsUpdating(true);
    try {
      await acceptRequest(request.id);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async (nextStatus: RequestStatus) => {
    setIsUpdating(true);
    try {
      await updateRequestStatus(request.id, nextStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const canCancel = (currentUser?.role === 'elderly' || currentUser?.role === 'family' || currentUser?.role === 'admin') 
    && request.status !== 'completed' && request.status !== 'cancelled';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top back navigation and header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">{request.title}</h2>
              <Badge status={request.status} />
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Request ID: <span className="font-mono font-semibold text-slate-700">{request.id}</span> • Created on {new Date(request.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {canCancel && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsCancelModalOpen(true)}
              className="text-rose-700 hover:bg-rose-50 border-rose-200"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Cancel Request
            </Button>
          )}

          {request.status === 'completed' && !request.feedback && (currentUser?.role === 'elderly' || currentUser?.role === 'family') && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsFeedbackModalOpen(true)}
              icon={<Star className="w-4 h-4 fill-white" />}
            >
              Leave Feedback
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Details & Timeline, Right Volunteer Info & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Progress Timeline & Request Info */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tracking Milestone Stepper */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-600" />
                Live Assistance Milestone Timeline
              </h3>
              <span className="text-xs text-slate-400">Step-by-step verification</span>
            </div>

            {request.status === 'cancelled' && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">This request was cancelled.</p>
                  <p className="text-xs mt-0.5 text-rose-700">{request.cancellationReason || 'No specific reason provided.'}</p>
                </div>
              </div>
            )}

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {milestones.map((milestone) => {
                const state = getMilestoneState(milestone.status);
                const matchingEvent = request.timeline.find(t => t.status === milestone.status);

                return (
                  <div key={milestone.status} className="relative group">
                    {/* Dot Icon */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all ${
                        state === 'done'
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : state === 'current'
                          ? 'bg-teal-600 border-teal-600 text-white ring-4 ring-teal-100 animate-pulse'
                          : state === 'cancelled'
                          ? 'bg-rose-100 border-rose-400 text-rose-600'
                          : 'bg-white border-slate-300 text-slate-300'
                      }`}
                    >
                      {state === 'done' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-bold">●</span>
                      )}
                    </div>

                    <div className="pl-3">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <h4
                          className={`text-sm sm:text-base font-bold ${
                            state === 'done' || state === 'current'
                              ? 'text-slate-900'
                              : 'text-slate-400'
                          }`}
                        >
                          {milestone.label}
                        </h4>
                        {matchingEvent?.timestamp && (
                          <span className="text-xs text-slate-400">
                            {new Date(matchingEvent.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date(matchingEvent.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{milestone.desc}</p>
                      {matchingEvent?.description && (
                        <div className="mt-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-slate-700">
                          {matchingEvent.description}
                          {matchingEvent.actor && <span className="font-semibold"> — {matchingEvent.actor}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Request Details Card */}
          <Card className="space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 pb-3 border-b border-slate-100">
              <CategoryIcon category={request.category} className="w-5 h-5 text-teal-600" />
              Task Specifications & Instructions
            </h3>

            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</h4>
              <p className="text-sm text-slate-800 mt-1 leading-relaxed">{request.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <Calendar className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-slate-500">Scheduled Date & Time</span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">{request.preferredDate}</p>
                  <p className="text-xs text-slate-600">{request.preferredTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-slate-500">Pickup & Service Location</span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">{request.locality}</p>
                  <p className="text-xs text-slate-600">{request.location}</p>
                </div>
              </div>
            </div>

            {request.additionalInstructions && (
              <div className="pt-2">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Special Notes & Safety Instructions
                </h4>
                <div className="mt-1 p-3 rounded-xl bg-teal-50/50 border border-teal-200/60 text-xs sm:text-sm text-teal-900">
                  {request.additionalInstructions}
                </div>
              </div>
            )}
          </Card>

          {/* Feedback Display if already submitted */}
          {request.feedback && (
            <Card className="bg-emerald-50/40 border-emerald-200">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60 mb-3">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">Submitted Assistance Feedback</h3>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                  {[...Array(request.feedback.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                  <span className="ml-1 text-slate-700">({request.feedback.rating}/5)</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 italic">"{request.feedback.comment}"</p>
              {request.feedback.serviceQualityTags && request.feedback.serviceQualityTags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {request.feedback.serviceQualityTags.map(tag => (
                    <span key={tag} className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium">
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-3 text-[11px] text-slate-400">
                Submitted by {request.feedback.submittedBy} on {new Date(request.feedback.createdAt).toLocaleDateString()}
              </p>
            </Card>
          )}
        </div>

        {/* Right Column (4 cols): Volunteer & Role Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Volunteer Information Card */}
          <Card>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-teal-600" />
              Assigned Community Volunteer
            </h3>

            {request.assignedVolunteerId ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={request.assignedVolunteerAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'}
                    alt={request.assignedVolunteerName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500 shadow-sm"
                  />
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{request.assignedVolunteerName}</h4>
                    <span className="inline-flex items-center gap-1 text-xs text-teal-700 font-semibold mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Local Helper
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> Contact Phone:
                    </span>
                    <span className="font-mono font-bold text-slate-800">{request.assignedVolunteerPhone || '+1 (555) 456-7890'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Task Status:</span>
                    <span className="font-semibold text-teal-700 capitalize">{request.status.replace('_', ' ')}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-tight">
                  Notice: Volunteer contact details are made available to confirmed parties for coordination.
                </p>
              </div>
            ) : (
              <div className="text-center py-6 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Clock className="w-8 h-8 text-amber-500 mx-auto mb-2 animate-pulse" />
                <p className="text-sm font-semibold text-slate-700">Awaiting Volunteer Matching</p>
                <p className="text-xs text-slate-500 mt-1">
                  Local coordinators are checking available volunteers in {request.locality}.
                </p>
              </div>
            )}
          </Card>

          {/* Volunteer Actions (if current user is volunteer viewing this) */}
          {currentUser?.role === 'volunteer' && (
            <Card className="bg-teal-50/50 border-teal-200 space-y-3">
              <h3 className="font-bold text-teal-900 text-sm">Volunteer Action Center</h3>
              
              {request.status === 'pending' && (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleVolunteerAccept}
                  isLoading={isUpdating}
                >
                  Accept & Claim This Request
                </Button>
              )}

              {request.status === 'accepted' && (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => handleStatusChange('in_progress')}
                  isLoading={isUpdating}
                  icon={<Play className="w-4 h-4 fill-white" />}
                >
                  Start Assistance
                </Button>
              )}

              {request.status === 'in_progress' && (
                <Button
                  variant="success"
                  className="w-full"
                  onClick={() => handleStatusChange('completed')}
                  isLoading={isUpdating}
                  icon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Mark Assistance as Completed
                </Button>
              )}

              <p className="text-[11px] text-slate-500">
                Ensure safety and follow all non-emergency assistance standards.
              </p>
            </Card>
          )}

          {/* Requester Profile Summary */}
          <Card className="text-xs space-y-2 text-slate-600">
            <h4 className="font-bold text-slate-800 text-sm mb-2">Requester Summary</h4>
            <div className="flex justify-between">
              <span>Requested by:</span>
              <span className="font-bold text-slate-800">{request.requesterName}</span>
            </div>
            {request.forElderlyName && (
              <div className="flex justify-between">
                <span>For Senior Relative:</span>
                <span className="font-bold text-slate-800">{request.forElderlyName} ({request.forElderlyRelationship})</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Contact Phone:</span>
              <span className="font-mono font-medium text-slate-800">{request.requesterPhone}</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      <ConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancel}
        title="Cancel Assistance Request?"
        message="Are you sure you want to cancel this assistance request? Any assigned volunteer will be notified."
        confirmLabel="Yes, Cancel Request"
        isDestructive
        isLoading={isUpdating}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        requestId={request.id}
        volunteerId={request.assignedVolunteerId}
        volunteerName={request.assignedVolunteerName}
      />
    </div>
  );
};

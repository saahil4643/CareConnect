import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FeedbackModal } from '../../components/feedback/FeedbackModal';
import { Star, CheckCircle, HeartHandshake, MessageSquare } from 'lucide-react';
import { AssistanceRequest } from '../../types';

export const ElderlyFeedbackPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { requests } = useData();

  const [activeFeedbackReq, setActiveFeedbackReq] = useState<AssistanceRequest | null>(null);

  // Completed requests for this senior
  const completedRequests = requests.filter(
    r => (r.requesterId === currentUser?.id || r.forElderlyName === currentUser?.name) &&
         r.status === 'completed'
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-black text-slate-900">Feedback & Neighbor Reviews</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Share your gratitude, rate volunteer support, and help keep our community trustworthy.
        </p>
      </div>

      {completedRequests.length === 0 ? (
        <Card className="text-center py-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 mb-3">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Completed Assistance Visits Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Once a volunteer completes a task for you, you can rate your experience and write a thank-you note here.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {completedRequests.map(req => {
            const hasFeedback = !!req.feedback;

            return (
              <Card key={req.id} className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {req.id}
                      </span>
                      <h4 className="text-base font-bold text-slate-900">{req.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Completed on {new Date(req.updatedAt).toLocaleDateString()} • Assisted by{' '}
                      <strong>{req.assignedVolunteerName || 'Community Volunteer'}</strong>
                    </p>
                  </div>

                  <div>
                    {hasFeedback ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Feedback Submitted
                      </span>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setActiveFeedbackReq(req)}
                        icon={<Star className="w-4 h-4 fill-white" />}
                      >
                        Leave Feedback
                      </Button>
                    )}
                  </div>
                </div>

                {/* If feedback was submitted, display review details */}
                {req.feedback ? (
                  <div className="pt-4 space-y-2">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(req.feedback.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                      <span className="text-xs font-bold text-slate-700 ml-1">
                        {req.feedback.rating} out of 5 Stars
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 italic">
                      "{req.feedback.comment}"
                    </p>
                    {req.feedback.serviceQualityTags && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {req.feedback.serviceQualityTags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[11px] font-medium border border-teal-200"
                          >
                            ✓ {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="pt-3 text-xs text-slate-500 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    <span>Your feedback helps recognize kind volunteers and ensures high community quality.</span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Feedback Modal */}
      {activeFeedbackReq && (
        <FeedbackModal
          isOpen={!!activeFeedbackReq}
          onClose={() => setActiveFeedbackReq(null)}
          requestId={activeFeedbackReq.id}
          volunteerId={activeFeedbackReq.assignedVolunteerId}
          volunteerName={activeFeedbackReq.assignedVolunteerName}
        />
      )}
    </div>
  );
};

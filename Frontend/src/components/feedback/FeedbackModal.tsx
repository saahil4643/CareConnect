import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Star, CheckCircle } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  volunteerId?: string;
  volunteerName?: string;
}

const QUALITY_TAGS = [
  'Punctual & Reliable',
  'Kind & Caring',
  'Patient & Respectful',
  'Clear Communication',
  'Safe Transportation',
  'Thorough & Helpful',
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  requestId,
  volunteerId,
  volunteerName,
}) => {
  const { submitFeedback } = useData();
  const { currentUser } = useAuth();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please provide a brief feedback comment.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await submitFeedback({
        requestId,
        volunteerId,
        rating,
        comment: comment.trim(),
        serviceQualityTags: selectedTags,
        submittedBy: currentUser?.name || 'Requester',
      });
      setIsSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to submit feedback');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setComment('');
    setSelectedTags([]);
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isSubmitted ? 'Feedback Received' : 'Submit Assistance Feedback'}
      description={
        isSubmitted
          ? 'Thank you for helping keep CareConnect trustworthy and caring.'
          : volunteerName
          ? `How was your experience with volunteer ${volunteerName}?`
          : 'Share your experience with this assistance request.'
      }
      maxWidth="md"
    >
      {isSubmitted ? (
        <div className="text-center py-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-900">Thank You!</h4>
          <p className="text-sm text-slate-600 mt-1 max-w-sm mx-auto">
            Your review and rating have been recorded in the demo system to help recognize community volunteers.
          </p>
          <div className="mt-6">
            <Button variant="primary" onClick={handleClose}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
              {error}
            </div>
          )}

          {/* Star Rating */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Overall Rating: {rating} of 5 Stars
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map(star => {
                const isFilled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 rounded-lg hover:scale-110 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        isFilled
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-transparent text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quality Tag Chips */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              What went particularly well? (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {QUALITY_TAGS.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment text area */}
          <div>
            <label htmlFor="feedback-comment" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Your Feedback & Comments <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="feedback-comment"
              rows={3}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Tell us what you appreciated or any feedback on the assistance provided..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              required
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
            <Button variant="secondary" type="button" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Submit Feedback
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

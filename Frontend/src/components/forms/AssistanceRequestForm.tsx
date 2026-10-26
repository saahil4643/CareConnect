import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { AssistanceCategory } from '../../types';
import { ASSISTANCE_CATEGORIES } from '../../data/mockData';
import { CategoryIcon } from '../ui/CategoryIcon';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CheckCircle2, ArrowRight, ArrowLeft, Calendar, MapPin, Phone, FileText, Sparkles } from 'lucide-react';

interface AssistanceRequestFormProps {
  isForFamilyRelative?: boolean;
}

export const AssistanceRequestForm: React.FC<AssistanceRequestFormProps> = ({
  isForFamilyRelative = false,
}) => {
  const { currentUser } = useAuth();
  const { createRequest } = useData();
  const navigate = useNavigate();

  // Wizard Steps: 1: Category & Details, 2: Schedule & Location, 3: Review & Submit
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [category, setCategory] = useState<AssistanceCategory>('grocery');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM - 12:00 PM');
  const [locality, setLocality] = useState(currentUser?.locality || 'Downtown Maple District');
  const [location, setLocation] = useState(currentUser?.address || '');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '');
  const [additionalInstructions, setAdditionalInstructions] = useState('');

  // Family relative specific
  const [forElderlyName, setForElderlyName] = useState(currentUser?.elderlyName || '');
  const [forElderlyRelationship, setForElderlyRelationship] = useState(currentUser?.relationshipToElderly || 'Parent');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);

  // Set default sample values when category changes if title is empty
  const handleSelectCategory = (catId: AssistanceCategory) => {
    setCategory(catId);
    if (!title || title.startsWith('Need assistance')) {
      const catObj = ASSISTANCE_CATEGORIES.find(c => c.id === catId);
      setTitle(`Assistance with ${catObj?.label || 'Everyday Tasks'}`);
    }
  };

  const handleNextStep = () => {
    setError(null);
    if (step === 1) {
      if (!title.trim()) return setError('Please enter a brief request title.');
      if (!description.trim()) return setError('Please describe what you need assistance with.');
      if (isForFamilyRelative && !forElderlyName.trim()) {
        return setError("Please provide the elderly relative's name.");
      }
      setStep(2);
    } else if (step === 2) {
      if (!preferredDate) return setError('Please select a preferred date.');
      if (!locality.trim()) return setError('Please provide the neighborhood locality.');
      if (!location.trim()) return setError('Please specify pickup / assistance location.');
      if (!contactPhone.trim()) return setError('Please provide a contact phone number.');
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const newReq = await createRequest({
        category,
        title: title.trim(),
        description: description.trim(),
        preferredDate,
        preferredTime,
        locality: locality.trim(),
        location: location.trim(),
        requesterId: currentUser?.id || 'demo-user',
        requesterName: currentUser?.name || 'Community Member',
        requesterPhone: contactPhone.trim(),
        requesterRole: isForFamilyRelative ? 'family' : 'elderly',
        forElderlyName: isForFamilyRelative ? forElderlyName.trim() : undefined,
        forElderlyRelationship: isForFamilyRelative ? forElderlyRelationship.trim() : undefined,
        additionalInstructions: additionalInstructions.trim() || undefined,
      });

      setCreatedRequestId(newReq.id);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to submit request');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (createdRequestId) {
    return (
      <Card className="max-w-2xl mx-auto text-center py-12 px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 text-teal-600 mb-6 shadow-sm">
          <CheckCircle2 className="h-10 w-10 text-teal-600" />
        </div>
        <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider border border-teal-200">
          Request Submitted Successfully
        </span>
        <h3 className="mt-3 text-2xl font-extrabold text-slate-900">
          Your Assistance Request is Live!
        </h3>
        <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
          Generated Demo Reference ID: <span className="font-mono font-bold text-slate-900">{createdRequestId}</span>. 
          Your request is marked as <strong>Pending</strong> and community volunteers have been notified.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate(`/requests/${createdRequestId}`)}
          >
            Track Request Progress
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate(isForFamilyRelative ? '/family/requests' : '/elderly/requests')}
          >
            View All My Requests
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Wizard Header Progress Indicator */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {isForFamilyRelative ? 'Request Assistance for Elderly Relative' : 'Request Everyday Assistance'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Step {step} of 3: {step === 1 ? 'Category & Details' : step === 2 ? 'Schedule & Location' : 'Review & Submit'}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`h-2.5 rounded-full transition-all ${
                s === step
                  ? 'w-8 bg-teal-600'
                  : s < step
                  ? 'w-4 bg-teal-300'
                  : 'w-4 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
          {error}
        </div>
      )}

      {/* STEP 1: CATEGORY SELECTION & DESCRIPTION */}
      {step === 1 && (
        <div className="space-y-6">
          {isForFamilyRelative && (
            <Card className="bg-teal-50/50 border-teal-200/80 p-4 space-y-3">
              <h3 className="text-sm font-bold text-teal-900">Elderly Relative Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Relative's Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={forElderlyName}
                    onChange={e => setForElderlyName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Relationship to Senior
                  </label>
                  <input
                    type="text"
                    value={forElderlyRelationship}
                    onChange={e => setForElderlyRelationship(e.target.value)}
                    placeholder="e.g. Son, Daughter, Grandchild"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900"
                  />
                </div>
              </div>
            </Card>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Select Assistance Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ASSISTANCE_CATEGORIES.map(cat => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-teal-50 border-teal-600 shadow-sm ring-2 ring-teal-500/20'
                        : 'bg-white border-slate-200 hover:border-teal-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700'}`}>
                        <CategoryIcon category={cat.id} size={20} />
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-teal-600" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{cat.label}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cat.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1">
              Request Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Weekly grocery delivery from Maple Grocers"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the specific assistance needed (e.g. items needed, clinic name, walking assistance, heavy packages)..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button variant="primary" size="lg" onClick={handleNextStep} icon={<ArrowRight className="w-4 h-4" />}>
              Next: Schedule & Location
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: SCHEDULE, LOCATION & CONTACT */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1">
                Preferred Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={preferredDate}
                onChange={e => setPreferredDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1">
                Preferred Time Window <span className="text-rose-500">*</span>
              </label>
              <select
                value={preferredTime}
                onChange={e => setPreferredTime(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="09:00 AM - 11:00 AM">Morning (09:00 AM - 11:00 AM)</option>
                <option value="11:00 AM - 01:00 PM">Midday (11:00 AM - 01:00 PM)</option>
                <option value="02:00 PM - 04:00 PM">Afternoon (02:00 PM - 04:00 PM)</option>
                <option value="04:00 PM - 06:00 PM">Late Afternoon (04:00 PM - 06:00 PM)</option>
                <option value="Flexible / Any Time">Flexible during the day</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1">
                Neighborhood Locality <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={locality}
                onChange={e => setLocality(e.target.value)}
                placeholder="e.g. Downtown Maple District"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1">
                Contact Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1">
              Pickup or Assistance Location <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. 742 Evergreen Terrace, Apt 3B or Market to Home"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1">
              Additional Instructions or Access Details (Optional)
            </label>
            <textarea
              rows={3}
              value={additionalInstructions}
              onChange={e => setAdditionalInstructions(e.target.value)}
              placeholder="e.g. Intercom buzzer number, parking instructions, mobility cane assistance notes..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button variant="secondary" onClick={() => setStep(1)} icon={<ArrowLeft className="w-4 h-4" />}>
              Back to Details
            </Button>
            <Button variant="primary" size="lg" onClick={handleNextStep} icon={<ArrowRight className="w-4 h-4" />}>
              Next: Review Request
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & CONFIRMATION SUMMARY */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-teal-50/30 border-teal-200/70 p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-teal-200/60">
              <Sparkles className="w-5 h-5 text-teal-700" />
              <h3 className="font-extrabold text-slate-900 text-base">Request Summary Review</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-slate-500 font-semibold block">Category:</span>
                <span className="font-bold text-slate-900 capitalize">{category} Assistance</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Scheduled Window:</span>
                <span className="font-bold text-slate-900">{preferredDate} • {preferredTime}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Neighborhood:</span>
                <span className="font-bold text-slate-900">{locality}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Location:</span>
                <span className="font-bold text-slate-900">{location}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Contact Phone:</span>
                <span className="font-mono font-bold text-slate-900">{contactPhone}</span>
              </div>
              {isForFamilyRelative && (
                <div>
                  <span className="text-slate-500 font-semibold block">For Senior Relative:</span>
                  <span className="font-bold text-slate-900">{forElderlyName} ({forElderlyRelationship})</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-teal-200/60">
              <span className="text-slate-500 font-semibold text-xs block mb-1">Title & Task Instructions:</span>
              <p className="font-bold text-slate-900 text-sm">{title}</p>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">{description}</p>
              {additionalInstructions && (
                <p className="text-xs text-teal-800 mt-2 bg-teal-100/60 p-2.5 rounded-lg">
                  <strong>Notes:</strong> {additionalInstructions}
                </p>
              )}
            </div>
          </Card>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <span>ℹ️ CareConnect is a 100% free mutual-aid community platform. No payment details are ever asked.</span>
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button variant="secondary" type="button" onClick={() => setStep(2)} icon={<ArrowLeft className="w-4 h-4" />}>
              Edit Schedule & Location
            </Button>
            <Button
              variant="primary"
              size="xl"
              type="submit"
              isLoading={isSubmitting}
              className="bg-teal-700 hover:bg-teal-800"
            >
              Confirm & Submit Assistance Request
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

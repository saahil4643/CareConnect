import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ASSISTANCE_CATEGORIES } from '../../data/mockData';
import { AssistanceCategory } from '../../types';
import { ShieldCheck, Star, Award, CheckCircle, Info } from 'lucide-react';

export const VolunteerProfilePage: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [locality, setLocality] = useState(currentUser?.locality || '');
  const [serviceArea, setServiceArea] = useState(currentUser?.serviceArea || 'Within 5 miles of Downtown');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [skills, setSkills] = useState((currentUser?.skills || []).join(', '));
  const [availability, setAvailability] = useState((currentUser?.availability || []).join(', '));
  const [preferredCategories, setPreferredCategories] = useState<AssistanceCategory[]>(
    currentUser?.preferredCategories || ['grocery', 'medicine', 'appointment']
  );

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const toggleCategory = (catId: AssistanceCategory) => {
    setPreferredCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        locality: locality.trim(),
        serviceArea: serviceArea.trim(),
        bio: bio.trim(),
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        availability: availability.split(',').map(s => s.trim()).filter(Boolean),
        preferredCategories,
      });
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-black text-slate-900">Volunteer Profile & Credentials</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Update your availability, service locality, preferred assistance categories, and skills.
        </p>
      </div>

      {/* Verification Notice Requirement */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Volunteer Verification Notice</p>
          <p className="mt-0.5 leading-relaxed">
            The verification badges shown on CareConnect represent frontend demonstration state. 
            Real-world criminal background checks and identity verification require backend integration with official records services.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>Volunteer profile updated successfully!</span>
        </div>
      )}

      <Card className="p-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 mb-6">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'}
            alt={currentUser?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">{currentUser?.name}</h3>
              <Badge verification={currentUser?.verificationStatus || 'verified'} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Volunteer Member since {new Date(currentUser?.createdAt || '').toLocaleDateString()}
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mt-1">
              <span className="flex items-center gap-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{currentUser?.rating || 4.9}</span>
              </span>
              <span>•</span>
              <span className="text-teal-700">{currentUser?.completedTasksCount || 28} Visits Completed</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Home Locality / City
              </label>
              <input
                type="text"
                required
                value={locality}
                onChange={e => setLocality(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Service Radius / Area
              </label>
              <input
                type="text"
                value={serviceArea}
                onChange={e => setServiceArea(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Preferred Assistance Categories */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Preferred Assistance Categories
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ASSISTANCE_CATEGORIES.map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-colors ${
                    preferredCategories.includes(cat.id)
                      ? 'bg-teal-700 text-white border-teal-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{cat.label}</span>
                  {preferredCategories.includes(cat.id) && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Skills & Certifications (Comma separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={e => setSkills(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Availability Windows (Comma separated)
              </label>
              <input
                type="text"
                value={availability}
                onChange={e => setAvailability(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Short Biography (Shown to Seniors)
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button variant="primary" type="submit" size="lg" isLoading={isSaving}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

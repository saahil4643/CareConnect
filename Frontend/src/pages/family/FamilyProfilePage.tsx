import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Users, Heart, CheckCircle, Shield } from 'lucide-react';

export const FamilyProfilePage: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();

  // Family Coordinator fields
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [locality, setLocality] = useState(currentUser?.locality || '');

  // Elderly Relative fields
  const [relationshipToElderly, setRelationshipToElderly] = useState(currentUser?.relationshipToElderly || 'Son');
  const [elderlyName, setElderlyName] = useState(currentUser?.elderlyName || '');
  const [elderlyPhone, setElderlyPhone] = useState(currentUser?.elderlyPhone || '');
  const [elderlyAddress, setElderlyAddress] = useState(currentUser?.elderlyAddress || '');

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        locality: locality.trim(),
        relationshipToElderly: relationshipToElderly.trim(),
        elderlyName: elderlyName.trim(),
        elderlyPhone: elderlyPhone.trim(),
        elderlyAddress: elderlyAddress.trim(),
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
        <h2 className="text-2xl font-black text-slate-900">Family Coordinator Profile</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your coordinator contact information and the profile of your elderly relative.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>Profile and relative details updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Family Member's Own Account */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Users className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">Your Coordinator Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Contact Phone
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Email Address
              </label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Locality
              </label>
              <input
                type="text"
                value={locality}
                onChange={e => setLocality(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </div>
        </Card>

        {/* Section 2: Assisted Elderly Relative Details (Clear Separation) */}
        <Card className="p-6 space-y-4 bg-teal-50/30 border-teal-200/70">
          <div className="flex items-center gap-2.5 pb-3 border-b border-teal-200/60">
            <Heart className="w-5 h-5 text-teal-700" />
            <h3 className="font-bold text-slate-900 text-base">Elderly Relative Being Assisted</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Relative's Full Name
              </label>
              <input
                type="text"
                required
                value={elderlyName}
                onChange={e => setElderlyName(e.target.value)}
                placeholder="e.g. Eleanor Vance"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Relationship to Them
              </label>
              <input
                type="text"
                required
                value={relationshipToElderly}
                onChange={e => setRelationshipToElderly(e.target.value)}
                placeholder="e.g. Son, Daughter, Grandchild, Guardian"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Relative's Direct Phone (If available)
              </label>
              <input
                type="tel"
                value={elderlyPhone}
                onChange={e => setElderlyPhone(e.target.value)}
                placeholder="e.g. +1 (555) 234-5678"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Relative's Residence Address
              </label>
              <input
                type="text"
                required
                value={elderlyAddress}
                onChange={e => setElderlyAddress(e.target.value)}
                placeholder="e.g. 742 Evergreen Terrace, Apt 3B"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <Button variant="primary" type="submit" size="lg" isLoading={isSaving}>
            Save All Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

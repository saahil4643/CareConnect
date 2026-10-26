import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { User, Phone, MapPin, Mail, Shield, CheckCircle } from 'lucide-react';

export const ElderlyProfilePage: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [locality, setLocality] = useState(currentUser?.locality || '');
  const [address, setAddress] = useState(currentUser?.address || '');
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
        address: address.trim(),
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
        <h2 className="text-2xl font-black text-slate-900">Senior Member Profile</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your personal details, home address, and emergency contact details.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      <Card className="p-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 mb-6">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'}
            alt={currentUser?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500"
          />
          <div>
            <h3 className="text-lg font-bold text-slate-900">{currentUser?.name}</h3>
            <p className="text-xs text-slate-500 capitalize">{currentUser?.role} Account • {currentUser?.locality}</p>
            <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              <Shield className="w-3 h-3 text-teal-600" /> Active Member
            </span>
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
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
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
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Neighborhood / Locality
              </label>
              <input
                type="text"
                required
                value={locality}
                onChange={e => setLocality(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Home Residence Address
            </label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="e.g. 742 Evergreen Terrace, Apt 3B"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Your exact address is only shared with a confirmed volunteer after a task is assigned.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button variant="primary" type="submit" isLoading={isSaving} size="lg">
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

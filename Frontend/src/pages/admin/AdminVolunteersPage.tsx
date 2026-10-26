import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { User, VerificationStatus } from '../../types';
import { 
  ShieldCheck, 
  Search, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle, 
  Clock, 
  Eye,
  Filter
} from 'lucide-react';
import { storageService } from '../../services/storageService';

export const AdminVolunteersPage: React.FC = () => {
  const { volunteers, refreshData } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [selectedVolunteer, setSelectedVolunteer] = useState<User | null>(null);

  const filteredVolunteers = volunteers.filter(vol => {
    const matchesSearch =
      vol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vol.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vol.skills && vol.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesVerification =
      verificationFilter === 'all' || vol.verificationStatus === verificationFilter;

    return matchesSearch && matchesVerification;
  });

  const handleToggleVerification = async (vol: User) => {
    const nextStatus: VerificationStatus =
      vol.verificationStatus === 'verified' ? 'pending' : 'verified';

    await storageService.updateUser(vol.id, { verificationStatus: nextStatus });
    await refreshData();
    if (selectedVolunteer?.id === vol.id) {
      setSelectedVolunteer({ ...selectedVolunteer, verificationStatus: nextStatus });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Volunteer Community Network</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage volunteer profiles, verified credentials, service areas, and performance metrics.
          </p>
        </div>
      </div>

      {/* Verification Notice */}
      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
        <span>
          <strong>Admin Verification Console:</strong> In this demo, toggling verification updates local browser state. 
          In production, this triggers background criminal record and DMV checks through the Django REST Framework.
        </span>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search volunteers by name, locality, or skill (e.g. First Aid)..."
            className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none"
          />
        </div>

        <select
          value={verificationFilter}
          onChange={e => setVerificationFilter(e.target.value)}
          className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-teal-500 focus:outline-none w-full md:w-auto"
        >
          <option value="all">All Verification Statuses</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending Review</option>
        </select>
      </div>

      {/* Volunteers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVolunteers.map(vol => (
          <Card key={vol.id} className="p-5 flex flex-col justify-between hover:border-teal-300 transition-all space-y-4">
            <div>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={vol.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'}
                    alt={vol.name}
                    className="w-12 h-12 rounded-xl object-cover border"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">{vol.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{vol.locality}</span>
                    </p>
                  </div>
                </div>
                <Badge verification={vol.verificationStatus || 'verified'} size="sm" />
              </div>

              <div className="pt-2 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Rating / Performance:</span>
                  <span className="font-bold text-amber-600 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{vol.rating || 5.0} ({vol.completedTasksCount || 0} tasks)</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Service Area:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[150px]">{vol.serviceArea || vol.locality}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Contact:</span>
                  <span className="font-mono text-slate-800">{vol.phone}</span>
                </div>

                {vol.skills && vol.skills.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">Key Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {vol.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleToggleVerification(vol)}
                className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-colors ${
                  vol.verificationStatus === 'verified'
                    ? 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100'
                    : 'text-teal-700 bg-teal-50 border-teal-200 hover:bg-teal-100'
                }`}
              >
                {vol.verificationStatus === 'verified' ? 'Revoke Verify' : 'Approve Verify'}
              </button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedVolunteer(vol)}
                icon={<Eye className="w-3.5 h-3.5" />}
              >
                Full Profile
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Volunteer Full Profile Modal */}
      {selectedVolunteer && (
        <Modal
          isOpen={!!selectedVolunteer}
          onClose={() => setSelectedVolunteer(null)}
          title="Volunteer Community Record"
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <img
                src={selectedVolunteer.avatar}
                alt={selectedVolunteer.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500"
              />
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedVolunteer.name}</h3>
                <Badge verification={selectedVolunteer.verificationStatus || 'verified'} size="sm" />
                <p className="text-xs text-slate-500 mt-1">{selectedVolunteer.email} • {selectedVolunteer.phone}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div>
                <span className="font-bold text-slate-500 block uppercase text-[10px]">Biography</span>
                <p className="text-slate-800 mt-0.5">{selectedVolunteer.bio || 'Active community volunteer.'}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="font-bold text-slate-500 block uppercase text-[10px]">Locality & Radius</span>
                  <p className="text-slate-800">{selectedVolunteer.locality} ({selectedVolunteer.serviceArea || '5 mi'})</p>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block uppercase text-[10px]">Availability</span>
                  <p className="text-slate-800">{(selectedVolunteer.availability || []).join(', ') || 'Flexible'}</p>
                </div>
              </div>

              {selectedVolunteer.skills && (
                <div className="pt-2">
                  <span className="font-bold text-slate-500 block uppercase text-[10px] mb-1">Declared Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedVolunteer.skills.map(s => (
                      <span key={s} className="px-2.5 py-1 bg-teal-50 text-teal-800 text-xs font-medium rounded-lg border border-teal-200">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button variant="secondary" onClick={() => setSelectedVolunteer(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

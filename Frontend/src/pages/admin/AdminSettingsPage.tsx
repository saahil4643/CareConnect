import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { Settings, RotateCcw, ShieldCheck, Database, CheckCircle, Info } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { resetDemoData } = useData();

  const [platformName, setPlatformName] = useState('CareConnect');
  const [supportEmail, setSupportEmail] = useState('admin@careconnect.demo');
  const [maxRadiusMiles, setMaxRadiusMiles] = useState('15');
  const [enableAutoMatching, setEnableAutoMatching] = useState(true);
  const [requireVolunteerVerification, setRequireVolunteerVerification] = useState(true);

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleConfirmReset = async () => {
    setIsResetting(true);
    try {
      await resetDemoData();
      setIsResetModalOpen(false);
      alert('Demo database reset to default initial state.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-black text-slate-900">System Parameters & Settings</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Configure CareConnect community coordination rules, security policies, and demo storage state.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>System configuration parameters saved.</span>
        </div>
      )}

      {/* Backend Integration Info Box */}
      <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs sm:text-sm space-y-1">
        <div className="flex items-center gap-2 font-bold text-teal-950">
          <Database className="w-5 h-5 text-teal-700" />
          <span>Django REST Framework Integration Ready</span>
        </div>
        <p className="text-xs text-teal-800 leading-relaxed">
          The application service layer in <code className="bg-teal-100 px-1 py-0.5 rounded font-mono">src/services/storageService.ts</code> is structured around asynchronous endpoints.
          When deploying with your Django backend, simply replace the local storage functions with your standard REST API calls.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Settings className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">Community Platform Settings</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Platform Name
              </label>
              <input
                type="text"
                value={platformName}
                onChange={e => setPlatformName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Coordinator Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={e => setSupportEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Maximum Volunteer Radius (Miles)
            </label>
            <input
              type="number"
              value={maxRadiusMiles}
              onChange={e => setMaxRadiusMiles(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer text-xs sm:text-sm text-slate-700">
              <input
                type="checkbox"
                checked={enableAutoMatching}
                onChange={e => setEnableAutoMatching(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span>Enable smart proximity suggestion for volunteers</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer text-xs sm:text-sm text-slate-700">
              <input
                type="checkbox"
                checked={requireVolunteerVerification}
                onChange={e => setRequireVolunteerVerification(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span>Require coordinator verification badge before allowing appointment escorts</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button variant="primary" type="submit">
              Save Parameters
            </Button>
          </div>
        </Card>

        {/* Demo Storage Controls */}
        <Card className="p-6 space-y-4 border-rose-200 bg-rose-50/20">
          <div className="flex items-center gap-2 pb-3 border-b border-rose-100 text-rose-900">
            <RotateCcw className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-base">Reset Demo Data</h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Reset all test accounts, created assistance requests, and reviews back to the clean initial pre-seeded state. 
            Useful for running repeatable demonstrations for college project evaluations.
          </p>

          <div>
            <Button
              variant="danger"
              size="md"
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              icon={<RotateCcw className="w-4 h-4" />}
            >
              Reset Demo State to Initial Mock Data
            </Button>
          </div>
        </Card>
      </form>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset All Demo Data?"
        message="This will reset all LocalStorage data (users, requests, timeline events, and notifications) back to the pre-seeded defaults."
        confirmLabel="Yes, Reset Data"
        isDestructive
        isLoading={isResetting}
      />
    </div>
  );
};

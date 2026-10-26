import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserRole } from '../../types';
import { Sparkles, RotateCcw, Type, ShieldCheck, Heart, Users, UserCheck } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { currentUser, demoLogin } = useAuth();
  const { resetDemoData } = useData();
  const { textSize, toggleTextSize } = useAccessibility();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleSwitch = async (role: UserRole) => {
    await demoLogin(role);
    if (role === 'elderly') navigate('/elderly');
    else if (role === 'family') navigate('/family');
    else if (role === 'volunteer') navigate('/volunteer');
    else if (role === 'admin') navigate('/admin');
  };

  const handleReset = async () => {
    if (window.confirm('Reset all demo data back to initial state? This clears changes made during testing.')) {
      await resetDemoData();
      alert('Demo data has been reset to initial state.');
    }
  };

  const roles: { role: UserRole; label: string; icon: React.ReactNode }[] = [
    { role: 'elderly', label: 'Elderly', icon: <Heart className="w-3.5 h-3.5" /> },
    { role: 'family', label: 'Family', icon: <Users className="w-3.5 h-3.5" /> },
    { role: 'volunteer', label: 'Volunteer', icon: <UserCheck className="w-3.5 h-3.5" /> },
    { role: 'admin', label: 'Admin', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-slate-900 text-slate-100 text-xs px-3 sm:px-4 py-2 border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        {/* Left: Demo Indicator & Non-Emergency Notice */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30">
            <Sparkles className="w-3 h-3 text-teal-400" />
            Frontend Demo Mode
          </span>
          <span className="hidden md:inline text-slate-400">
            Local browser storage • Non-emergency assistance only • Ready for Django REST API
          </span>
        </div>

        {/* Right: Quick Role Switcher + Accessibility + Reset */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 hidden lg:inline">Switch Role:</span>
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            {roles.map(({ role, label, icon }) => {
              const isActive = currentUser?.role === role && location.pathname.startsWith(`/${role}`);
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleSwitch(role)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                  title={`Switch active demo session to ${label}`}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Text Size Accessibility Toggle */}
          <button
            type="button"
            onClick={toggleTextSize}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
              textSize === 'large'
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle normal or large text for elderly readability"
          >
            <Type className="w-3.5 h-3.5" />
            <span>Text: {textSize === 'large' ? 'Large (Aa)' : 'Normal'}</span>
          </button>

          {/* Reset Demo State Button */}
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-rose-300 hover:bg-slate-700 border border-slate-700 transition-colors"
            title="Reset demo data to default mock records"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { Menu, Type, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onToggleSidebar }) => {
  const { currentUser } = useAuth();
  const { textSize, toggleTextSize } = useAccessibility();

  return (
    <header className="sticky top-8 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="flex items-center justify-between">
        {/* Left: Mobile hamburger & welcome */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Welcome back, {currentUser?.name?.split(' ')[0] || 'Friend'}</span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                {currentUser?.role === 'elderly'
                  ? 'Senior Member'
                  : currentUser?.role === 'family'
                  ? 'Family Coordinator'
                  : currentUser?.role === 'volunteer'
                  ? 'Community Volunteer'
                  : 'Administrator'}
              </span>
            </h1>
          </div>
        </div>

        {/* Right: Accessibility Text Size + Notification + Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Text Size Accessibility Toggle */}
          <button
            type="button"
            onClick={toggleTextSize}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              textSize === 'large'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title="Adjust text size for easier reading"
            aria-label="Adjust text size"
          >
            <Type className="w-4 h-4" />
            <span className="hidden sm:inline">{textSize === 'large' ? 'Large Mode' : 'Text Size'}</span>
          </button>

          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* View Public Site Link */}
          <Link
            to="/"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Public Site</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

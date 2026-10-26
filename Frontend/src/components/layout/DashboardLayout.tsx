import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DemoBanner } from '../ui/DemoBanner';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import { AlertCircle } from 'lucide-react';

interface DashboardLayoutProps {
  allowedRoles?: string[];
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ allowedRoles }) => {
  const { currentUser, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-600">Loading CareConnect Workspace...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If role is restricted and user doesn't match, redirect to their role's dashboard
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to={`/${currentUser.role}`} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Demo Banner */}
      <DemoBanner />

      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:pl-64 sm:lg:pl-72 min-w-0">
          <DashboardHeader onToggleSidebar={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>

          {/* Persistent Non-Emergency Reminder Footer */}
          <footer className="py-4 px-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-500">
            <div className="flex items-center justify-center gap-2 max-w-2xl mx-auto">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                CareConnect is for non-emergency everyday errands. For immediate medical emergencies or danger, call <strong>911</strong> immediately.
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

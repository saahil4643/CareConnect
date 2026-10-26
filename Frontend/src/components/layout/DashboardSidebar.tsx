import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Heart,
  LayoutDashboard,
  PlusCircle,
  Clock,
  UserCheck,
  Bell,
  Star,
  User as UserIcon,
  LogOut,
  X,
  FileText,
  Users,
  Shield,
  BarChart3,
  Settings,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, onClose }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getNavLinks = () => {
    if (!currentUser) return [];

    switch (currentUser.role) {
      case 'elderly':
        return [
          { to: '/elderly', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" />, end: true },
          { to: '/elderly/request-help', label: 'Request Help', icon: <PlusCircle className="w-5 h-5 text-teal-600 font-bold" /> },
          { to: '/elderly/requests', label: 'My Requests', icon: <Clock className="w-5 h-5" /> },
          { to: '/elderly/volunteer', label: 'Assigned Volunteer', icon: <UserCheck className="w-5 h-5" /> },
          { to: '/elderly/notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
          { to: '/elderly/feedback', label: 'Feedback & Reviews', icon: <Star className="w-5 h-5" /> },
          { to: '/elderly/profile', label: 'My Profile', icon: <UserIcon className="w-5 h-5" /> },
        ];
      case 'family':
        return [
          { to: '/family', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" />, end: true },
          { to: '/family/request-help', label: 'Request for Relative', icon: <PlusCircle className="w-5 h-5 text-teal-600" /> },
          { to: '/family/requests', label: "Relative's Requests", icon: <Clock className="w-5 h-5" /> },
          { to: '/family/volunteer', label: 'Assigned Volunteer', icon: <UserCheck className="w-5 h-5" /> },
          { to: '/family/notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
          { to: '/family/profile', label: 'Profile & Settings', icon: <UserIcon className="w-5 h-5" /> },
        ];
      case 'volunteer':
        return [
          { to: '/volunteer', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" />, end: true },
          { to: '/volunteer/available', label: 'Available Requests', icon: <Calendar className="w-5 h-5 text-teal-600" /> },
          { to: '/volunteer/tasks', label: 'My Active Tasks', icon: <Clock className="w-5 h-5" /> },
          { to: '/volunteer/history', label: 'Completed Tasks', icon: <CheckCircle2 className="w-5 h-5" /> },
          { to: '/volunteer/profile', label: 'Volunteer Profile', icon: <UserIcon className="w-5 h-5" /> },
        ];
      case 'admin':
        return [
          { to: '/admin', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-5 h-5" />, end: true },
          { to: '/admin/requests', label: 'Assistance Requests', icon: <FileText className="w-5 h-5" /> },
          { to: '/admin/volunteers', label: 'Volunteers Network', icon: <Shield className="w-5 h-5" /> },
          { to: '/admin/users', label: 'User Directory', icon: <Users className="w-5 h-5" /> },
          { to: '/admin/reports', label: 'Feedback & Reports', icon: <BarChart3 className="w-5 h-5" /> },
          { to: '/admin/settings', label: 'System Settings', icon: <Settings className="w-5 h-5" /> },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 sm:w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
              <Heart className="h-5 w-5 fill-white" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg">CareConnect</span>
              <span className="block text-[10px] font-semibold text-teal-600 uppercase tracking-wider">
                {currentUser?.role === 'elderly'
                  ? 'Elderly Portal'
                  : currentUser?.role === 'family'
                  ? 'Family Portal'
                  : currentUser?.role === 'volunteer'
                  ? 'Volunteer Workspace'
                  : 'Coordinator Admin'}
              </span>
            </div>
          </NavLink>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 shadow-xs border border-teal-200/80 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <span className="shrink-0">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Card & Logout at bottom */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={currentUser?.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900 truncate">{currentUser?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{currentUser?.role}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

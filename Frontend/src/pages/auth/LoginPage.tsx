import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { DemoBanner } from '../../components/ui/DemoBanner';
import { Button } from '../../components/ui/Button';
import { Heart, Eye, EyeOff, Lock, Mail, Users, HeartHandshake, ShieldCheck, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, demoLogin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    const success = await login(email);
    if (success) {
      if (redirectParam === 'request') {
        navigate('/elderly/request-help');
      } else {
        navigate('/elderly');
      }
    } else {
      setError('Unrecognized email in local demo records. You can click any of the 1-Click Demo Accounts below!');
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setError(null);
    await demoLogin(role);
    if (redirectParam === 'request' && (role === 'elderly' || role === 'family')) {
      navigate(`/${role}/request-help`);
    } else {
      navigate(`/${role}`);
    }
  };

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col justify-between">
      <DemoBanner />

      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3 focus:outline-none">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md">
              <Heart className="h-6 w-6 fill-white" />
            </div>
            <span className="text-2xl font-black text-slate-900">CareConnect</span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Sign in to your account
          </h2>
          <p className="mt-1.5 text-sm text-slate-600">
            Select an account or use instant 1-Click Demo Access
          </p>
        </div>

        {/* 1-Click Demo Quick Access (Highlighted for Examiners) */}
        <div className="bg-white rounded-2xl border border-teal-200/80 p-5 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
              Instant Demo Access
            </span>
            <span className="text-xs text-slate-500">No typing needed:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleDemoLogin('elderly')}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all group"
            >
              <div className="p-2 rounded-lg bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Elderly Person</p>
                <p className="text-[11px] text-slate-500">Eleanor Vance</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('family')}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all group"
            >
              <div className="p-2 rounded-lg bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Family Member</p>
                <p className="text-[11px] text-slate-500">David Vance</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('volunteer')}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all group"
            >
              <div className="p-2 rounded-lg bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Community Volunteer</p>
                <p className="text-[11px] text-slate-500">Sarah Jenkins</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all group"
            >
              <div className="p-2 rounded-lg bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Administrator</p>
                <p className="text-[11px] text-slate-500">Arthur Pendelton</p>
              </div>
            </button>
          </div>
        </div>

        {/* Regular Login Form */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-sm font-semibold text-slate-800 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. eleanor@careconnect.demo"
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-semibold text-slate-800 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-10 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>Remember me on this device</span>
              </label>

              <button
                type="button"
                onClick={() => alert('Demo Mode: In production, password reset email will be sent via Django REST Framework.')}
                className="text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-800"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs sm:text-sm text-slate-600">
              Don’t have an account yet?{' '}
              <Link to="/register" className="font-bold text-teal-700 hover:text-teal-800">
                Register as a member or volunteer
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Notice: CareConnect demonstration mode stores session data in your browser.
        </p>
      </div>

      <div className="py-4 text-center text-xs text-slate-400 border-t border-slate-200">
        CareConnect Community Coordination System • Frontend Demo
      </div>
    </div>
  );
};

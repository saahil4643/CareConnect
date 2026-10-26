import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Button } from '../ui/Button';
import { Heart, Menu, X, Type } from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser } = useAuth();
  const { textSize, toggleTextSize } = useAccessibility();
  const navigate = useNavigate();

  const handleGetAssistance = () => {
    if (currentUser) {
      if (currentUser.role === 'elderly') navigate('/elderly/request-help');
      else if (currentUser.role === 'family') navigate('/family/request-help');
      else navigate(`/${currentUser.role}`);
    } else {
      navigate('/login?redirect=request');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-xl p-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-600/20 group-hover:bg-teal-700 transition-colors">
              <Heart className="h-6 w-6 fill-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                CareConnect
              </span>
              <span className="hidden sm:block text-[11px] font-medium text-slate-500">
                A little help. A stronger community.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors">
              How It Works
            </a>
            <a href="#services" className="text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors">
              Our Services
            </a>
            <a href="#impact" className="text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors">
              Community Impact
            </a>
            <a href="#volunteer" className="text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors">
              Become a Volunteer
            </a>
            <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors">
              Testimonials
            </a>
          </nav>

          {/* Action CTAs & Accessibility */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTextSize}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                textSize === 'large'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Toggle text size for readability"
              aria-label="Toggle text size"
            >
              <Type className="w-4 h-4" />
              <span>{textSize === 'large' ? 'Large Font' : 'Font Size'}</span>
            </button>

            {currentUser ? (
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate(`/${currentUser.role}`)}
              >
                Go to Dashboard ({currentUser.role})
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="md"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            )}

            <Button
              variant="primary"
              size="md"
              onClick={handleGetAssistance}
            >
              Get Assistance
            </Button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTextSize}
              className="p-2 rounded-xl bg-slate-100 text-slate-700"
              aria-label="Toggle font size"
            >
              <Type className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-2">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              How It Works
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Our Services
            </a>
            <a
              href="#impact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Community Impact
            </a>
            <a
              href="#volunteer"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Become a Volunteer
            </a>
            <a
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Testimonials
            </a>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            {currentUser ? (
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(`/${currentUser.role}`);
                }}
              >
                Go to Dashboard ({currentUser.role})
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
              >
                Sign In
              </Button>
            )}

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => {
                setMobileMenuOpen(false);
                handleGetAssistance();
              }}
            >
              Request Assistance
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, AlertTriangle, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Prominent Emergency Disclaimer Box */}
        <div className="mb-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-5 sm:p-6 text-amber-200 flex items-start gap-4">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-amber-300">
              Emergency Disclaimer & Non-Emergency Notice
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
              CareConnect is a mutual-aid community platform designed exclusively for everyday, non-emergency tasks 
              (such as grocery delivery, medicine pickup, and companion transportation). CareConnect is 
              <strong> not an emergency response service</strong> and does not provide urgent medical care. 
              If you or an elderly relative are experiencing an acute medical emergency, chest pain, fall injury, or urgent danger, 
              please immediately call <strong>911</strong> (or your local emergency services).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white">
                <Heart className="h-5 w-5 fill-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                CareConnect
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              A community volunteer and elderly assistance coordination platform connecting seniors with trusted, 
              compassionate neighbors for everyday errands and companionship.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Designed for Dignity, Independence, and Safety</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Our Services
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="#services" className="hover:text-teal-400 transition-colors">Grocery Delivery</a></li>
              <li><a href="#services" className="hover:text-teal-400 transition-colors">Medicine Collection</a></li>
              <li><a href="#services" className="hover:text-teal-400 transition-colors">Medical Appointment Escort</a></li>
              <li><a href="#services" className="hover:text-teal-400 transition-colors">Transportation</a></li>
              <li><a href="#services" className="hover:text-teal-400 transition-colors">Household Assistance</a></li>
              <li><a href="#services" className="hover:text-teal-400 transition-colors">Social Companionship</a></li>
            </ul>
          </div>

          {/* Roles & Portals */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Community Roles
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/elderly" className="hover:text-teal-400 transition-colors">Elderly Dashboard</Link></li>
              <li><Link to="/family" className="hover:text-teal-400 transition-colors">Family Member Portal</Link></li>
              <li><Link to="/volunteer" className="hover:text-teal-400 transition-colors">Volunteer Workspace</Link></li>
              <li><Link to="/admin" className="hover:text-teal-400 transition-colors">Coordinator Administration</Link></li>
              <li><Link to="/register" className="hover:text-teal-400 transition-colors">Volunteer Registration</Link></li>
              <li><Link to="/login" className="hover:text-teal-400 transition-colors">Account Sign In</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact & Support
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Helpline: (800) 555-CARE</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>help@careconnect.community</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Downtown Community Hub</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CareConnect Frontend Project. Built for Community Assistance Demonstration.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Volunteer Code of Conduct</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

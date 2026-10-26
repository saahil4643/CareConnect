import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole, AssistanceCategory } from '../../types';
import { DemoBanner } from '../../components/ui/DemoBanner';
import { Button } from '../../components/ui/Button';
import { ASSISTANCE_CATEGORIES } from '../../data/mockData';
import { Heart, UserCheck, Users, HeartHandshake, CheckCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRoleParam = searchParams.get('role');
  const [role, setRole] = useState<UserRole>(
    initialRoleParam === 'volunteer'
      ? 'volunteer'
      : initialRoleParam === 'family'
      ? 'family'
      : 'elderly'
  );

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [locality, setLocality] = useState('');
  const [address, setAddress] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Volunteer specific
  const [skills, setSkills] = useState<string>('First Aid, Valid Drivers License, Friendly Companion');
  const [preferredCategories, setPreferredCategories] = useState<AssistanceCategory[]>(['grocery', 'medicine']);
  const [availability, setAvailability] = useState<string>('Weekday mornings, Saturday');
  const [serviceArea, setServiceArea] = useState<string>('Within 5 miles of Downtown');
  const [bio, setBio] = useState<string>('');

  // Family specific
  const [relationshipToElderly, setRelationshipToElderly] = useState('Son / Daughter');
  const [elderlyName, setElderlyName] = useState('');
  const [elderlyPhone, setElderlyPhone] = useState('');
  const [elderlyAddress, setElderlyAddress] = useState('');

  const [error, setError] = useState<string | null>(null);

  const toggleCategory = (catId: AssistanceCategory) => {
    setPreferredCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) return setError('Please enter your full name.');
    if (!email.trim() || !email.includes('@')) return setError('Please enter a valid email address.');
    if (!phone.trim()) return setError('Please enter a phone number.');
    if (!locality.trim()) return setError('Please enter your city or neighborhood locality.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    if (!termsAccepted) return setError('You must agree to the CareConnect Community Terms & Non-Emergency guidelines.');

    try {
      const newUser = await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role,
        locality: locality.trim(),
        address: address.trim() || undefined,
        // Volunteer extras
        skills: role === 'volunteer' ? skills.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        preferredCategories: role === 'volunteer' ? preferredCategories : undefined,
        availability: role === 'volunteer' ? availability.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        serviceArea: role === 'volunteer' ? serviceArea : undefined,
        bio: role === 'volunteer' ? bio : undefined,
        // Family extras
        relationshipToElderly: role === 'family' ? relationshipToElderly : undefined,
        elderlyName: role === 'family' ? elderlyName : undefined,
        elderlyPhone: role === 'family' ? elderlyPhone : undefined,
        elderlyAddress: role === 'family' ? elderlyAddress : undefined,
      });

      // Redirect to newly registered role's dashboard
      navigate(`/${newUser.role}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed. Please check inputs.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col justify-between">
      <DemoBanner />

      <div className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-2 focus:outline-none">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md">
              <Heart className="h-5 w-5 fill-white" />
            </div>
            <span className="text-2xl font-black text-slate-900">CareConnect</span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Create your account
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Join your local community network for assistance or volunteering
          </p>
        </div>

        {/* Role Selector Tabs (Only Elderly, Family, Volunteer - Admin is restricted) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm mb-8">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 pt-1 pb-2">
            Select Your Role
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setRole('elderly')}
              className={`flex items-center sm:flex-col justify-center gap-2 p-3 rounded-xl border text-center transition-all ${
                role === 'elderly'
                  ? 'bg-teal-50 border-teal-600 text-teal-900 ring-2 ring-teal-500/20 font-bold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <HeartHandshake className="w-5 h-5 text-teal-600" />
              <div>
                <span className="block text-sm font-semibold">Elderly Person</span>
                <span className="text-[11px] text-slate-500 font-normal">Need assistance</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('family')}
              className={`flex items-center sm:flex-col justify-center gap-2 p-3 rounded-xl border text-center transition-all ${
                role === 'family'
                  ? 'bg-teal-50 border-teal-600 text-teal-900 ring-2 ring-teal-500/20 font-bold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Users className="w-5 h-5 text-teal-600" />
              <div>
                <span className="block text-sm font-semibold">Family Member</span>
                <span className="text-[11px] text-slate-500 font-normal">Coordinate for loved one</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('volunteer')}
              className={`flex items-center sm:flex-col justify-center gap-2 p-3 rounded-xl border text-center transition-all ${
                role === 'volunteer'
                  ? 'bg-teal-50 border-teal-600 text-teal-900 ring-2 ring-teal-500/20 font-bold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <UserCheck className="w-5 h-5 text-teal-600" />
              <div>
                <span className="block text-sm font-semibold">Volunteer</span>
                <span className="text-[11px] text-slate-500 font-normal">Offer kind help</span>
              </div>
            </button>
          </div>
        </div>

        {/* Registration Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Standard Profile Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Neighborhood or City Locality <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={locality}
                  onChange={e => setLocality(e.target.value)}
                  placeholder="e.g. Maple District"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                Street Address (Kept Private until Task Confirmed)
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="e.g. 124 Oak Street, Apt 4"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            {/* VOLUNTEER SPECIFIC SECTION */}
            {role === 'volunteer' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/60 border border-teal-200/80 space-y-4 pt-4 mt-6">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-teal-700" />
                  <h3 className="text-sm font-bold text-teal-900">Volunteer Qualifications & Preferences</h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal-950 mb-1.5">
                    Preferred Assistance Categories
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ASSISTANCE_CATEGORIES.map(cat => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-colors ${
                          preferredCategories.includes(cat.id)
                            ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{cat.label}</span>
                        {preferredCategories.includes(cat.id) && <CheckCircle className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-teal-950 mb-1">
                      Skills & Certifications
                    </label>
                    <input
                      type="text"
                      value={skills}
                      onChange={e => setSkills(e.target.value)}
                      placeholder="e.g. CPR Certified, Valid License, Patient"
                      className="w-full rounded-xl border border-teal-200 bg-white px-3 py-2 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-teal-950 mb-1">
                      Availability Windows
                    </label>
                    <input
                      type="text"
                      value={availability}
                      onChange={e => setAvailability(e.target.value)}
                      placeholder="e.g. Weekday Mornings, Weekends"
                      className="w-full rounded-xl border border-teal-200 bg-white px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal-950 mb-1">
                    Service Area Radius
                  </label>
                  <input
                    type="text"
                    value={serviceArea}
                    onChange={e => setServiceArea(e.target.value)}
                    placeholder="e.g. Maple District, North Suburbs (up to 5 miles)"
                    className="w-full rounded-xl border border-teal-200 bg-white px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal-950 mb-1">
                    Short Bio (Tell seniors a little about yourself)
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="e.g. Friendly neighbor with a reliable car happy to help with morning market runs."
                    className="w-full rounded-xl border border-teal-200 bg-white px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>
            )}

            {/* FAMILY MEMBER SPECIFIC SECTION */}
            {role === 'family' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/60 border border-teal-200/80 space-y-4 pt-4 mt-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-700" />
                  <h3 className="text-sm font-bold text-teal-900">Elderly Relative Information (Optional)</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-teal-950 mb-1">
                      Relationship to Senior
                    </label>
                    <input
                      type="text"
                      value={relationshipToElderly}
                      onChange={e => setRelationshipToElderly(e.target.value)}
                      placeholder="e.g. Son, Daughter, Grandchild, Neighbor"
                      className="w-full rounded-xl border border-teal-200 bg-white px-3 py-2 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-teal-950 mb-1">
                      Elderly Relative Full Name
                    </label>
                    <input
                      type="text"
                      value={elderlyName}
                      onChange={e => setElderlyName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full rounded-xl border border-teal-200 bg-white px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal-950 mb-1">
                    Elderly Relative Residence Address
                  </label>
                  <input
                    type="text"
                    value={elderlyAddress}
                    onChange={e => setElderlyAddress(e.target.value)}
                    placeholder="e.g. 742 Evergreen Terrace, Apt 3B"
                    className="w-full rounded-xl border border-teal-200 bg-white px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>
            )}

            {/* Terms and Non-Emergency Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>
                  I understand that <strong>CareConnect is for non-emergency assistance only</strong> and agree to the 
                  Community Standards, privacy protections, and verified volunteer guidelines.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4"
              isLoading={isLoading}
            >
              Complete Registration & Access Dashboard
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs sm:text-sm text-slate-600">
              Already have a CareConnect account?{' '}
              <Link to="/login" className="font-bold text-teal-700 hover:text-teal-800">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="py-4 text-center text-xs text-slate-400 border-t border-slate-200">
        CareConnect Community Coordination System • Frontend Demo
      </div>
    </div>
  );
};

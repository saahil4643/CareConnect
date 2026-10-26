import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { DemoBanner } from '../../components/ui/DemoBanner';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { CategoryIcon } from '../../components/ui/CategoryIcon';
import { ASSISTANCE_CATEGORIES } from '../../data/mockData';
import { 
  Heart, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Star,
  Award,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleRequestAssistance = () => {
    if (currentUser) {
      if (currentUser.role === 'elderly') navigate('/elderly/request-help');
      else if (currentUser.role === 'family') navigate('/family/request-help');
      else navigate(`/${currentUser.role}`);
    } else {
      navigate('/login?redirect=request');
    }
  };

  const handleBecomeVolunteer = () => {
    navigate('/register?role=volunteer');
  };

  return (
    <div className="min-h-screen bg-warm-50 text-slate-900 flex flex-col">
      {/* Demo Banner */}
      <DemoBanner />

      {/* Main Navbar */}
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32 bg-gradient-to-b from-teal-50/50 via-white to-warm-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs sm:text-sm font-semibold border border-teal-200">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Caring Neighbors • Verified Assistance • Safe Community</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Compassionate Help, <br className="hidden sm:inline" />
                <span className="text-teal-700">Right in Your Community.</span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Connect with trusted community volunteers for everyday assistance, from grocery shopping and medicine collection to medical appointment support.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Button
                  size="xl"
                  variant="primary"
                  onClick={handleRequestAssistance}
                  icon={<ArrowRight className="w-5 h-5 ml-1" />}
                  className="w-full sm:w-auto"
                >
                  Request Assistance
                </Button>
                <Button
                  size="xl"
                  variant="outline"
                  onClick={handleBecomeVolunteer}
                  icon={<Users className="w-5 h-5" />}
                  className="w-full sm:w-auto"
                >
                  Become a Volunteer
                </Button>
              </div>

              {/* Trust Badge */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-slate-500 font-medium border-t border-slate-200/60 max-w-lg mx-auto lg:mx-0">
                <div className="flex items-center gap-1.5 text-teal-800 font-semibold">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  <span>Connecting people</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5 text-teal-800 font-semibold">
                  <Heart className="w-5 h-5 text-teal-600" />
                  <span>Supporting independence</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5 text-teal-800 font-semibold">
                  <Users className="w-5 h-5 text-teal-600" />
                  <span>Strengthening communities</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Background decorative blob */}
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-teal-200/40 rounded-full blur-3xl -z-10" />
                <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl -z-10" />

                <div className="overflow-hidden rounded-3xl border-4 border-white shadow-2xl bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80"
                    alt="Elderly senior and helpful smiling community volunteer walking together"
                    className="w-full h-80 sm:h-96 object-cover object-center transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="p-5 bg-white border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-700">
                        <Heart className="w-5 h-5 fill-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Community Kindness in Action</p>
                        <p className="text-xs text-slate-500">Everyday non-emergency support with dignity</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                      100% Free Service
                    </span>
                  </div>
                </div>

                {/* Floating pill card */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200/80 hidden sm:flex items-center gap-3 max-w-xs">
                  <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Rapid Response Matching</p>
                    <p className="text-[11px] text-slate-500">Most requests confirmed within 2 to 4 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Simple 3-Step Process
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
              How CareConnect Works
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600">
              Getting neighborly support is straightforward, secure, and respectful of your schedule.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-warm-50 rounded-2xl p-8 border border-slate-200/80 shadow-xs relative flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-teal-600/20 mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Request Help</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Tell us what assistance you need—grocery errands, medicine pick-up, or a ride to your clinic.
              </p>
              <span className="mt-auto text-xs font-semibold text-teal-700">Elderly or Family Member can submit</span>
            </div>

            {/* Step 2 */}
            <div className="bg-warm-50 rounded-2xl p-8 border border-slate-200/80 shadow-xs relative flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-teal-700/20 mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Get Connected</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Our platform pairs you with an available, suitable volunteer who reviews your schedule and confirms the task.
              </p>
              <span className="mt-auto text-xs font-semibold text-teal-700">Receive volunteer profile & contact</span>
            </div>

            {/* Step 3 */}
            <div className="bg-warm-50 rounded-2xl p-8 border border-slate-200/80 shadow-xs relative flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-emerald-600/20 mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Receive Support</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Track your request in real time, receive compassionate assistance, and leave a review afterwards.
              </p>
              <span className="mt-auto text-xs font-semibold text-teal-700">Simple 5-star feedback rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-warm-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Everyday Assistance
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
              Our Non-Emergency Support Services
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600">
              Thoughtfully curated everyday tasks to support independence and peaceful living.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {ASSISTANCE_CATEGORIES.map(category => (
              <Card
                key={category.id}
                hoverable
                className="flex flex-col justify-between border-slate-200/90 transition-all hover:scale-[1.01]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
                      <CategoryIcon category={category.id} size={24} />
                    </div>
                    {category.popular && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        Popular Service
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {category.label}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {category.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-teal-700">Community Volunteer</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (currentUser?.role === 'family') navigate('/family/request-help');
                      else navigate('/elderly/request-help');
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors"
                  >
                    <span>Request This</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Impact Statistics */}
      <section id="impact" className="py-16 bg-teal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-teal-200 uppercase tracking-widest bg-teal-700/60 px-3 py-1 rounded-full border border-teal-600">
              Community Impact (Illustrative Demo)
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-white">
              Strengthening Neighborhood Bonds
            </h2>
            <p className="mt-2 text-sm text-teal-100">
              *The following figures represent illustrative demo statistics for platform demonstration.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-teal-900/40 border border-teal-700/60">
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-200">1,420+</p>
              <p className="mt-2 text-xs sm:text-sm font-medium text-teal-100">Requests Completed</p>
            </div>
            <div className="p-6 rounded-2xl bg-teal-900/40 border border-teal-700/60">
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-200">380+</p>
              <p className="mt-2 text-xs sm:text-sm font-medium text-teal-100">Active Volunteers</p>
            </div>
            <div className="p-6 rounded-2xl bg-teal-900/40 border border-teal-700/60">
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-200">890+</p>
              <p className="mt-2 text-xs sm:text-sm font-medium text-teal-100">Seniors Supported</p>
            </div>
            <div className="p-6 rounded-2xl bg-teal-900/40 border border-teal-700/60">
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-200">99.4%</p>
              <p className="mt-2 text-xs sm:text-sm font-medium text-teal-100">Satisfaction Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Become a Volunteer Section */}
      <section id="volunteer" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-teal-900 to-slate-900 rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-xl relative overflow-hidden">
            <div className="max-w-3xl space-y-6">
              <span className="text-xs font-bold text-teal-300 uppercase tracking-widest bg-teal-800/80 px-3 py-1 rounded-full border border-teal-700">
                Join As A Volunteer
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Make a Real Difference in an Older Neighbor’s Life.
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Whether you have an hour a week to pick up groceries or can give someone a companion ride to a clinic, 
                your time creates real dignity and human connection.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-400 shrink-0" />
                  <span className="text-sm text-slate-200">Choose your own tasks and flexible availability</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-400 shrink-0" />
                  <span className="text-sm text-slate-200">Stay within your preferred neighborhood locality</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-400 shrink-0" />
                  <span className="text-sm text-slate-200">Earn recognized community service hours</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-400 shrink-0" />
                  <span className="text-sm text-slate-200">Full coordinator support and orientation</span>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  size="xl"
                  variant="primary"
                  onClick={handleBecomeVolunteer}
                  className="bg-teal-500 hover:bg-teal-600 text-white font-bold"
                >
                  Join Our Community as Volunteer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-warm-50 border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Community Voices
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
              Sample Community Experiences
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              *Sample testimonials for demonstration purposes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 italic leading-relaxed mb-6">
                  "Having Sarah pick up my monthly heart medications saved me from having to walk in the rain. 
                  She was so cheerful and respectful."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=80"
                  alt="Eleanor Vance"
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">Eleanor Vance (74)</p>
                  <p className="text-xs text-slate-500">Senior Resident, Maple District</p>
                </div>
              </div>
            </Card>

            <Card className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 italic leading-relaxed mb-6">
                  "As a busy working son, being able to schedule an appointment escort for my mother from my laptop 
                  gives our whole family incredible peace of mind."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="David Vance"
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">David Vance</p>
                  <p className="text-xs text-slate-500">Family Member Coordinator</p>
                </div>
              </div>
            </Card>

            <Card className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 italic leading-relaxed mb-6">
                  "Volunteering on Saturday mornings has connected me with wonderful older neighbors. 
                  CareConnect makes it simple to accept only the tasks near my street."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                  alt="Sarah Jenkins"
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">Sarah Jenkins</p>
                  <p className="text-xs text-slate-500">Community Volunteer (28 Tasks)</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
};

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CategoryIcon } from '../../components/ui/CategoryIcon';
import { ShieldCheck, Phone, MapPin, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FamilyVolunteerPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { requests, volunteers } = useData();

  const familyRequests = requests.filter(
    r => (r.requesterId === currentUser?.id || r.requesterRole === 'family') && r.assignedVolunteerId
  );

  const assignedVolunteersList = volunteers.filter(vol =>
    familyRequests.some(r => r.assignedVolunteerId === vol.id)
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-black text-slate-900">
          Assigned Volunteers for {currentUser?.elderlyName || 'Relative'}
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          View background, skills, and direct contact options for community volunteers assisting your family member.
        </p>
      </div>

      {assignedVolunteersList.length === 0 ? (
        <Card className="text-center py-12 px-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 mb-4">
            <Clock className="w-8 h-8 text-teal-600 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Assigned Volunteer at This Time</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
            When a local volunteer is matched with your relative's requests, their contact information and verified qualifications will be shown here.
          </p>
          <Link to="/family/request-help">
            <Button variant="primary">Create an Assistance Request</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          {assignedVolunteersList.map(vol => {
            const tasks = familyRequests.filter(r => r.assignedVolunteerId === vol.id);

            return (
              <Card key={vol.id} className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <img
                      src={vol.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'}
                      alt={vol.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl font-bold text-slate-900">{vol.name}</h3>
                        <Badge verification={vol.verificationStatus || 'verified'} />
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Locality: {vol.locality}</span>
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs font-semibold text-slate-700">
                        <span className="flex items-center gap-1 text-amber-500">
                          <Star className="w-4 h-4 fill-amber-400" />
                          <span>{vol.rating || 4.9} Rating</span>
                        </span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">
                          {vol.completedTasksCount || 18} Completed Visits
                        </span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`tel:${vol.phone}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold hover:bg-teal-100 transition-colors self-start sm:self-auto"
                  >
                    <Phone className="w-4 h-4 text-teal-700" />
                    <span>Call Volunteer: {vol.phone}</span>
                  </a>
                </div>

                <div className="text-xs sm:text-sm">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs mb-1">
                    Volunteer Background & Bio
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    {vol.bio || 'Compassionate neighborhood volunteer dedicated to supporting local seniors with safe transport, prescription collection, and friendly check-ins.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 text-sm mb-3">
                    Assisting Your Relative With ({tasks.length} tasks)
                  </h4>
                  <div className="space-y-2">
                    {tasks.map(task => (
                      <div
                        key={task.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 gap-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg text-teal-700 border border-slate-200">
                            <CategoryIcon category={task.category} size={18} />
                          </div>
                          <div>
                            <span className="font-bold text-xs text-slate-900">{task.title}</span>
                            <span className="text-[11px] text-slate-500 block">
                              Scheduled: {task.preferredDate} ({task.preferredTime})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge status={task.status} size="sm" />
                          <Link to={`/requests/${task.id}`}>
                            <Button variant="outline" size="sm">
                              Track Task
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

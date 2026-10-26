import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CategoryIcon } from '../../components/ui/CategoryIcon';
import { ShieldCheck, Phone, Mail, MapPin, Star, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AssignedVolunteerPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { requests, volunteers } = useData();

  // Find requests with assigned volunteers for this senior
  const myAssignedRequests = requests.filter(
    r => (r.requesterId === currentUser?.id || r.forElderlyName === currentUser?.name) &&
         r.assignedVolunteerId
  );

  // Get distinct assigned volunteers
  const assignedVolunteersList = volunteers.filter(vol =>
    myAssignedRequests.some(r => r.assignedVolunteerId === vol.id)
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-black text-slate-900">Assigned Community Volunteers</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Verified neighborhood helpers committed to assisting you with scheduled tasks.
        </p>
      </div>

      {assignedVolunteersList.length === 0 ? (
        <Card className="text-center py-12 px-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 mb-4">
            <Clock className="w-8 h-8 text-teal-600 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Volunteer Assigned Yet</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
            When a volunteer accepts or is matched to your assistance request, their profile and direct contact options will appear here.
          </p>
          <Link to="/elderly/request-help">
            <Button variant="primary">Create an Assistance Request</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          {assignedVolunteersList.map(vol => {
            const tasksForVol = myAssignedRequests.filter(r => r.assignedVolunteerId === vol.id);
            const activeTask = tasksForVol.find(r => r.status === 'in_progress' || r.status === 'accepted' || r.status === 'assigned');

            return (
              <Card key={vol.id} className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <img
                      src={vol.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'}
                      alt={vol.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-teal-500 shadow-sm"
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
                      <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-slate-700">
                        <span className="flex items-center gap-1 text-amber-500">
                          <Star className="w-4 h-4 fill-amber-400" />
                          <span>{vol.rating || 4.9} Rating</span>
                        </span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">
                          {vol.completedTasksCount || 24} Community Visits Completed
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 self-start sm:self-auto">
                    <a
                      href={`tel:${vol.phone}`}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold hover:bg-teal-100 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-teal-700" />
                      <span>{vol.phone}</span>
                    </a>
                  </div>
                </div>

                {/* Bio & Skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs mb-1">
                      About {vol.name}
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      {vol.bio || 'Dedicated community volunteer passionate about assisting older neighbors with daily errands and friendly visits.'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs mb-2">
                      Verified Skills & Capabilities
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(vol.skills || ['First Aid Certified', 'Valid Driving License', 'Patient Communication']).map(skill => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                        >
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Assigned Tasks with this Volunteer */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 text-sm mb-3">
                    Assistance Tasks Assigned to {vol.name} ({tasksForVol.length})
                  </h4>
                  <div className="space-y-2">
                    {tasksForVol.map(task => (
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

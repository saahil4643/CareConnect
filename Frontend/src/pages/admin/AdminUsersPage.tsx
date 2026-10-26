import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { User, UserRole } from '../../types';
import { storageService } from '../../services/storageService';
import { Search, UserCheck, ShieldAlert, CheckCircle, Eye, UserPlus, Filter } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { allUsers, refreshData } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = allUsers.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.locality.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = async (user: User) => {
    const nextStatus = user.status === 'suspended' ? 'active' : 'suspended';
    await storageService.updateUser(user.id, { status: nextStatus });
    await refreshData();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900">User Directory & Roles</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Overview of seniors, family caregivers, community volunteers, and administrative personnel.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search users by name, email, or city..."
            className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-teal-500 focus:outline-none w-full md:w-auto"
        >
          <option value="all">All Roles</option>
          <option value="elderly">Elderly Persons</option>
          <option value="family">Family Members</option>
          <option value="volunteer">Volunteers</option>
          <option value="admin">Administrators</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Locality</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Registered</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No users match search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const isSuspended = user.status === 'suspended';

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                            alt={user.name}
                            className="w-9 h-9 rounded-xl object-cover border"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{user.name}</span>
                            <span className="text-slate-400 text-[11px] block">{user.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                            user.role === 'elderly'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : user.role === 'family'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : user.role === 'volunteer'
                              ? 'bg-teal-50 text-teal-800 border border-teal-200'
                              : 'bg-purple-50 text-purple-800 border border-purple-200'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700">{user.locality}</td>

                      <td className="py-3.5 px-4 font-mono text-slate-700">{user.phone}</td>

                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isSuspended
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isSuspended ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          {isSuspended ? 'Suspended' : 'Active'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                            title="Inspect User Details"
                          >
                            <Eye className="w-4 h-4 text-slate-600" />
                          </Button>

                          {user.role !== 'admin' && (
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(user)}
                              className={`text-[11px] font-bold px-2 py-1 rounded-md border transition-colors ${
                                isSuspended
                                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                                  : 'text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100'
                              }`}
                            >
                              {isSuspended ? 'Activate' : 'Suspend'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title="User Account Details"
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedUser.name}</h3>
                <p className="text-xs text-slate-500 capitalize">{selectedUser.role} Account • ID: {selectedUser.id}</p>
                <p className="text-xs text-slate-500 mt-0.5">{selectedUser.email} • {selectedUser.phone}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Registered Locality:</span>
                <span className="font-bold text-slate-900">{selectedUser.locality}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Address on Record:</span>
                <span className="font-bold text-slate-900">{selectedUser.address || 'Confidential / None'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Registration Date:</span>
                <span className="font-bold text-slate-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
              </div>

              {selectedUser.elderlyName && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Linked Senior Relative:</span>
                  <span className="font-bold text-slate-900">{selectedUser.elderlyName} ({selectedUser.relationshipToElderly})</span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button variant="secondary" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

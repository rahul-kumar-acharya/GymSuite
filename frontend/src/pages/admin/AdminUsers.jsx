import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Search, ShieldCheck } from 'lucide-react';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/gyms/superadmin/all-users/');
      setUsers(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-espresso-800">System Accounts & Roles</h1>
        <p className="text-xs text-mutedGray">Master directory of all platform users across Super Admin, Owners, Staff, Trainers, and Members</p>
      </div>

      <div className="bg-white rounded-2xl border border-sand overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100/70 border-b border-sand text-espresso-800 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">User Name</th>
                <th className="p-4">Email / Username</th>
                <th className="p-4">Role</th>
                <th className="p-4">Associated Gym</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand text-charcoal">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-mutedGray">Loading users...</td>
                </tr>
              ) : users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-cream-50 transition-colors">
                    <td className="p-4 font-bold text-espresso-800">{u.first_name} {u.last_name || u.username}</td>
                    <td className="p-4 font-semibold">{u.email || u.username}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        u.role === 'SUPERADMIN' ? 'bg-espresso-900 text-brass-400' :
                        u.role === 'OWNER' ? 'bg-statusGreen-bg text-statusGreen-text' : 'bg-cream-200 text-espresso-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-espresso-800">{u.gym_name || 'System Wide'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-mutedGray">No user accounts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

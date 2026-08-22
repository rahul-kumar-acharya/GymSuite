import React from 'react';
import { UserCog, Plus, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Staff = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-espresso-800">Staff & Receptionist Management</h1>
        <p className="text-xs text-mutedGray">Manage receptionist accounts, staff permissions, and role access</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-sand shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-sand pb-4">
          <h3 className="font-heading text-xl font-bold text-espresso-800">Active Gym Staff</h3>
          <span className="text-xs font-bold text-brass-600 bg-cream-100 px-3 py-1 rounded-full">Role Scoped</span>
        </div>

        <div className="p-4 rounded-xl bg-cream-100 border border-sand flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-espresso-800 text-brass-400 flex items-center justify-center font-bold">
              {user?.first_name ? user.first_name[0] : 'S'}
            </div>
            <div>
              <p className="font-bold text-espresso-800 text-sm">{user?.first_name} {user?.last_name} (You)</p>
              <span className="text-xs text-mutedGray">{user?.email} • {user?.role}</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-statusGreen-bg text-statusGreen-text">Primary Owner</span>
        </div>
      </div>
    </div>
  );
};

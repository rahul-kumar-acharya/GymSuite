import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Dumbbell, Users, CheckCircle2 } from 'lucide-react';

export const TrainerDashboard = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignedMembers();
  }, []);

  const fetchAssignedMembers = async () => {
    try {
      const res = await api.get('/members/');
      setMembers(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-espresso-800 text-cream-100 rounded-3xl p-6 sm:p-8 space-y-2 shadow-md">
        <h1 className="font-heading text-2xl font-bold">Trainer Command Portal</h1>
        <p className="text-xs text-cream-200/80">Manage client workout assignments and progress tracking.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-sand shadow-xs space-y-4">
        <h3 className="font-heading text-lg font-bold text-espresso-800">Assigned Gym Clients</h3>
        <div className="divide-y divide-sand text-xs">
          {loading ? (
            <p className="py-4 text-center text-mutedGray">Loading clients...</p>
          ) : members.length > 0 ? (
            members.map((m) => (
              <div key={m.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-espresso-800 text-sm">{m.full_name}</p>
                  <span className="text-[10px] text-mutedGray">{m.member_id_code} • {m.phone}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-statusGreen-bg text-statusGreen-text">
                  {m.status}
                </span>
              </div>
            ))
          ) : (
            <p className="py-4 text-center text-mutedGray">No assigned clients found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

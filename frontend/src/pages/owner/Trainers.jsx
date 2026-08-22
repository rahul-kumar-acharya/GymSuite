import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { UserCog, Plus, Dumbbell, ShieldCheck, Mail, Phone } from 'lucide-react';

export const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const res = await api.get('/trainers/');
      setTrainers(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-espresso-800">Trainer Management</h1>
        <p className="text-xs text-mutedGray">Manage gym trainers, specializations, monthly salaries, and client roster</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-xs text-mutedGray col-span-3 text-center py-12">Loading trainers...</p>
        ) : trainers.length > 0 ? (
          trainers.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl p-6 border border-sand shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-espresso-800 text-brass-400 flex items-center justify-center font-bold text-lg">
                  {t.trainer_name ? t.trainer_name[0] : 'T'}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-espresso-800">{t.trainer_name || 'Trainer'}</h3>
                  <span className="text-[10px] font-bold text-brass-600 uppercase tracking-wider">{t.specialization}</span>
                </div>
              </div>

              <div className="text-xs space-y-1 text-mutedGray border-t border-sand pt-3">
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-brass-500" />
                  <span>{t.trainer_email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-brass-500" />
                  <span>{t.trainer_phone || 'No phone'}</span>
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-sand pt-3 text-xs">
                <span className="text-mutedGray">Assigned Clients: <span className="font-bold text-espresso-800">{t.assigned_members_count}</span></span>
                <span className="font-bold text-statusGreen-text bg-statusGreen-bg px-2.5 py-1 rounded-md">₹{t.salary_monthly}/mo</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-mutedGray col-span-3 text-center py-12">No trainers registered yet.</p>
        )}
      </div>
    </div>
  );
};

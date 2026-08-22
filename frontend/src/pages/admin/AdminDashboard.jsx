import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Building2, Crown, Users, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const res = await api.get('/gyms/superadmin/stats/');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-mutedGray">Loading Super Admin analytics...</div>;
  }

  const overview = data?.overview || {};

  return (
    <div className="space-y-8">
      
      {/* Super Admin Header */}
      <div className="bg-espresso-900 text-cream-100 rounded-3xl p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-espresso-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brass-500/20 text-brass-400 text-xs font-semibold uppercase">
            <ShieldCheck className="w-4 h-4 text-brass-500" />
            <span>Master Super Admin Portal</span>
          </div>
          <h1 className="font-heading text-3xl font-bold">AcharyaWorks GymSuite Operations</h1>
          <p className="text-xs text-cream-200/80">Platform overview across all multi-tenant gym installations.</p>
        </div>

        <div className="text-right">
          <span className="text-xs text-cream-200/60 uppercase font-bold tracking-wider block">Monthly Recurring Revenue</span>
          <span className="font-heading text-4xl font-bold text-brass-400">₹{overview.mrr || '0'}</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-2xl p-6 border border-sand shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-mutedGray uppercase tracking-wider">Total Registered Gyms</span>
            <div className="w-10 h-10 rounded-xl bg-cream-100 text-espresso-800 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <span className="font-heading text-3xl font-bold text-espresso-800">{overview.total_gyms || 0}</span>
          <p className="text-[11px] text-mutedGray">Active platform tenants</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-sand shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-mutedGray uppercase tracking-wider">Active 30-Day Trials</span>
            <div className="w-10 h-10 rounded-xl bg-statusAmber-bg text-statusAmber-text flex items-center justify-center font-bold">
              <Crown className="w-5 h-5" />
            </div>
          </div>
          <span className="font-heading text-3xl font-bold text-espresso-800">{overview.active_trials || 0}</span>
          <p className="text-[11px] text-statusAmber-text font-semibold">Trial onboarding phase</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-sand shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-mutedGray uppercase tracking-wider">Paid Subscribers</span>
            <div className="w-10 h-10 rounded-xl bg-statusGreen-bg text-statusGreen-text flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <span className="font-heading text-3xl font-bold text-espresso-800">{overview.paid_gyms || 0}</span>
          <p className="text-[11px] text-statusGreen-text font-semibold">Active paid gym tenants</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-sand shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-mutedGray uppercase tracking-wider">Total Platform Members</span>
            <div className="w-10 h-10 rounded-xl bg-cream-100 text-espresso-800 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <span className="font-heading text-3xl font-bold text-espresso-800">{overview.total_members || 0}</span>
          <p className="text-[11px] text-mutedGray">Across all gym tenants</p>
        </div>

      </div>

      {/* Recent Registered Gyms */}
      <div className="bg-white rounded-2xl border border-sand p-6 space-y-4 shadow-xs">
        <h3 className="font-heading text-xl font-bold text-espresso-800">Recent Gym Registrations</h3>
        <div className="divide-y divide-sand text-xs">
          {data?.recent_gyms && data.recent_gyms.length > 0 ? (
            data.recent_gyms.map((g) => (
              <div key={g.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-espresso-800 text-sm">{g.name}</p>
                  <span className="text-[10px] text-mutedGray">{g.city}, {g.state} • {g.phone}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  g.status === 'ACTIVE' ? 'bg-statusGreen-bg text-statusGreen-text' : 'bg-statusAmber-bg text-statusAmber-text'
                }`}>
                  {g.status}
                </span>
              </div>
            ))
          ) : (
            <p className="py-6 text-center text-mutedGray">No gyms registered yet.</p>
          )}
        </div>
      </div>

    </div>
  );
};

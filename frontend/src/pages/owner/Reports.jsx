import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { BarChart3, TrendingUp, DollarSign, Users, Award } from 'lucide-react';

export const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports/dashboard/');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const overview = data?.overview || {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-espresso-800">Business Reports & Analytics</h1>
        <p className="text-xs text-mutedGray">Financial aggregation, membership renewal metrics, and profit margins</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-sand shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase text-mutedGray">Total Revenue</span>
          <p className="font-heading text-3xl font-bold text-statusGreen-text">₹{overview.monthly_revenue || '0'}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-sand shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase text-mutedGray">Total Expenses</span>
          <p className="font-heading text-3xl font-bold text-statusRed-text">₹{overview.monthly_expenses || '0'}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-sand shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase text-mutedGray">Net Profit</span>
          <p className="font-heading text-3xl font-bold text-espresso-800">₹{overview.net_profit || '0'}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-sand shadow-xs space-y-6">
        <h3 className="font-heading text-xl font-bold text-espresso-800">Membership Health Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-cream-100 border border-sand">
            <span className="text-xs text-mutedGray block">Total Members</span>
            <span className="font-heading text-2xl font-bold text-espresso-800">{overview.total_members}</span>
          </div>
          <div className="p-4 rounded-xl bg-statusGreen-bg/50 border border-sand">
            <span className="text-xs text-statusGreen-text block font-medium">Active Memberships</span>
            <span className="font-heading text-2xl font-bold text-statusGreen-text">{overview.active_members}</span>
          </div>
          <div className="p-4 rounded-xl bg-statusAmber-bg/50 border border-sand">
            <span className="text-xs text-statusAmber-text block font-medium">Expiring in 7 Days</span>
            <span className="font-heading text-2xl font-bold text-statusAmber-text">{overview.expiring_soon}</span>
          </div>
          <div className="p-4 rounded-xl bg-statusRed-bg/50 border border-sand">
            <span className="text-xs text-statusRed-text block font-medium">Expired Members</span>
            <span className="font-heading text-2xl font-bold text-statusRed-text">{overview.expired_members}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

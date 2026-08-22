import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Users, CreditCard, CalendarCheck, Award, TrendingUp, 
  Plus, AlertCircle, ArrowUpRight, CheckCircle2, Clock, DollarSign
} from 'lucide-react';

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get('/reports/dashboard/');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brass-500" />
      </div>
    );
  }

  const overview = data?.overview || {};

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-espresso-800 rounded-3xl p-6 sm:p-8 text-cream-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brass-500/20 text-brass-400 text-xs font-semibold uppercase">
            <span>30-Day Free Trial</span>
            <span>•</span>
            <span>{data?.days_left_in_trial} Days Remaining</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold">
            Welcome to {data?.gym_name || 'Your Gym'}
          </h1>
          <p className="text-xs sm:text-sm text-cream-200/80">
            Here is your gym's real-time performance overview for today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/members"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brass-500 text-espresso-900 text-xs font-bold hover:bg-brass-400 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </Link>
          <Link
            to="/attendance"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-espresso-900 text-cream-100 text-xs font-semibold hover:bg-espresso-900/80 border border-espresso-700 transition-all"
          >
            <CalendarCheck className="w-4 h-4 text-brass-400" />
            <span>Check-in Member</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-2xl p-6 border border-sand shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-mutedGray uppercase tracking-wider">Total Members</span>
            <div className="w-10 h-10 rounded-xl bg-cream-100 text-espresso-800 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-espresso-800">{overview.total_members || 0}</span>
            <span className="text-xs text-statusGreen-text font-semibold">{overview.active_members || 0} Active</span>
          </div>
          <p className="text-[11px] text-mutedGray">{overview.expiring_soon || 0} memberships expiring this week</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-sand shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-mutedGray uppercase tracking-wider">Attendance Today</span>
            <div className="w-10 h-10 rounded-xl bg-cream-100 text-espresso-800 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-espresso-800">{overview.attendance_today || 0}</span>
            <span className="text-xs text-brass-600 font-semibold">Check-ins</span>
          </div>
          <p className="text-[11px] text-mutedGray">Real-time daily activity log</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-sand shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-mutedGray uppercase tracking-wider">Monthly Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-cream-100 text-espresso-800 flex items-center justify-center">
              <Award className="w-5 h-5 text-brass-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-espresso-800">₹{overview.monthly_revenue || '0'}</span>
          </div>
          <p className="text-[11px] text-statusRed-text font-semibold">Pending Dues: ₹{overview.total_pending_due || '0'}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-sand shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-mutedGray uppercase tracking-wider">Net Profit</span>
            <div className="w-10 h-10 rounded-xl bg-cream-100 text-espresso-800 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-espresso-800">₹{overview.net_profit || '0'}</span>
          </div>
          <p className="text-[11px] text-mutedGray">Expenses: ₹{overview.monthly_expenses || '0'}</p>
        </div>

      </div>

      {/* Tables Section: Recent Check-ins & Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Check-ins */}
        <div className="bg-white rounded-2xl border border-sand p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xl font-bold text-espresso-800">Today's Check-ins</h3>
            <Link to="/attendance" className="text-xs font-bold text-brass-600 hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-sand">
            {data?.recent_checkins && data.recent_checkins.length > 0 ? (
              data.recent_checkins.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-cream-100 text-espresso-800 flex items-center justify-center font-bold text-xs">
                      {item.member_name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-espresso-800">{item.member_name}</p>
                      <span className="text-[10px] text-mutedGray">{item.method}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-brass-600 bg-cream-100 px-2.5 py-1 rounded-lg">
                    {item.check_in}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-mutedGray py-6 text-center">No check-ins recorded today yet.</p>
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-2xl border border-sand p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xl font-bold text-espresso-800">Recent Payments</h3>
            <Link to="/payments" className="text-xs font-bold text-brass-600 hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-sand">
            {data?.recent_payments && data.recent_payments.length > 0 ? (
              data.recent_payments.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-espresso-800">{item.member_name}</p>
                    <span className="text-[10px] text-mutedGray">{item.receipt_no} • {item.payment_method}</span>
                  </div>
                  <span className="text-xs font-bold text-statusGreen-text bg-statusGreen-bg px-2.5 py-1 rounded-lg">
                    +₹{item.amount_paid}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-mutedGray py-6 text-center">No payments collected recently.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

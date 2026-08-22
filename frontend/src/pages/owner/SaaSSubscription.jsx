import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Crown, Check, Zap, ShieldCheck } from 'lucide-react';

export const SaaSSubscription = () => {
  const [sub, setSub] = useState(null);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchSub();
    fetchPlans();
  }, []);

  const fetchSub = async () => {
    try {
      const res = await api.get('/subscriptions/my-subscription/');
      setSub(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await api.get('/subscriptions/plans/');
      setPlans(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-espresso-800">GymSuite SaaS Subscription</h1>
        <p className="text-xs text-mutedGray">Manage your gym's SaaS tier, trial status, and billing cycle</p>
      </div>

      <div className="bg-espresso-800 text-cream-100 rounded-3xl p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brass-500/20 text-brass-400 text-xs font-semibold uppercase">
            <Crown className="w-4 h-4 text-brass-500" />
            <span>30-Day Free Trial Active</span>
          </div>
          <h2 className="font-heading text-2xl font-bold">You have {sub?.days_left || 30} days left in your trial</h2>
          <p className="text-xs text-cream-200/80">All core features remain active without restriction during trial.</p>
        </div>

        <button
          onClick={() => alert('Razorpay SaaS payment gateway integration point.')}
          className="px-6 py-3 rounded-xl bg-brass-500 text-espresso-900 text-xs font-bold hover:bg-brass-400 shadow-md"
        >
          Upgrade Plan Now
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="font-heading text-xl font-bold text-espresso-800">Available SaaS Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(p => (
            <div key={p.id} className="bg-white rounded-2xl p-6 border border-sand space-y-4 shadow-xs">
              <h4 className="font-heading text-xl font-bold text-espresso-800">{p.name}</h4>
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-3xl font-bold text-espresso-800">₹{p.price_monthly}</span>
                <span className="text-xs text-mutedGray">/month</span>
              </div>
              <p className="text-xs text-mutedGray">{p.description}</p>
              <button
                onClick={() => alert(`Selected ${p.name} plan`)}
                className="w-full py-2.5 rounded-xl border border-espresso-800 text-espresso-800 text-xs font-bold hover:bg-espresso-800 hover:text-white transition-colors"
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

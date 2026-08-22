import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Crown, Check } from 'lucide-react';

export const AdminSubscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/subscriptions/plans/');
      setPlans(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-espresso-800">SaaS Tier Configurations</h1>
        <p className="text-xs text-mutedGray">Manage pricing tiers for GymSuite subscriptions across all gyms</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-xs text-mutedGray col-span-3 text-center py-12">Loading SaaS plans...</p>
        ) : plans.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl p-6 border border-sand shadow-xs space-y-4">
            <h3 className="font-heading text-xl font-bold text-espresso-800">{p.name}</h3>
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-3xl font-bold text-espresso-800">₹{p.price_monthly}</span>
              <span className="text-xs text-mutedGray">/month</span>
            </div>
            <p className="text-xs text-mutedGray">{p.description}</p>
            <div className="pt-3 border-t border-sand text-xs font-bold text-brass-600">
              Max Members: {p.max_members === -1 ? 'Unlimited' : p.max_members}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

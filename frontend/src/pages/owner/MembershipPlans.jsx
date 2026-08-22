import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CreditCard, Plus, Check, Clock, X } from 'lucide-react';

export const MembershipPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    duration_days: 30,
    price: '',
    description: ''
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/memberships/plans/');
      setPlans(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      await api.post('/memberships/plans/', formData);
      setShowModal(false);
      setFormData({ name: '', duration_days: 30, price: '', description: '' });
      fetchPlans();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create plan');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-espresso-800">Membership Plans</h1>
          <p className="text-xs text-mutedGray">Configure gym plans for monthly, quarterly, yearly, or custom duration</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-espresso-800 text-cream-100 text-sm font-bold shadow-md hover:bg-espresso-900 transition-all"
        >
          <Plus className="w-4 h-4 text-brass-400" />
          <span>Create New Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-xs text-mutedGray col-span-3 text-center py-12">Loading membership plans...</p>
        ) : plans.length > 0 ? (
          plans.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl p-6 border border-sand shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xl font-bold text-espresso-800">{p.name}</span>
                  <span className="text-xs font-mono font-bold text-brass-600 bg-cream-100 px-3 py-1 rounded-full">
                    {p.duration_days} Days
                  </span>
                </div>
                <p className="text-xs text-mutedGray leading-relaxed">{p.description || 'Standard gym access plan.'}</p>
                <div className="flex items-baseline gap-1 pt-2">
                  <span className="font-heading text-3xl font-bold text-espresso-800">₹{p.price}</span>
                  <span className="text-xs text-mutedGray">/ duration</span>
                </div>
              </div>
              <div className="pt-4 border-t border-sand flex items-center justify-between text-xs text-mutedGray">
                <span>Status: <span className="font-bold text-statusGreen-text">Active</span></span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-mutedGray col-span-3 text-center py-12">No plans configured yet. Click 'Create New Plan' to add your first plan.</p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-sand space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-sand pb-4">
              <h3 className="font-heading text-xl font-bold text-espresso-800">Create Membership Plan</h3>
              <button onClick={() => setShowModal(false)} className="text-mutedGray hover:text-espresso-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Plan Title</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-sand bg-cream-50 text-xs font-medium"
                  placeholder="e.g. Quarterly Transformation"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    required
                    value={formData.duration_days}
                    onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-sand bg-cream-50 text-xs font-medium"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-sand bg-cream-50 text-xs font-medium"
                    placeholder="1500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-sand bg-cream-50 text-xs font-medium"
                  placeholder="Details about locker access, cardio, trainer, etc."
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/3 py-2.5 rounded-xl border border-sand text-xs font-bold text-espresso-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-espresso-800 text-cream-100 text-xs font-bold shadow-md hover:bg-espresso-900"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

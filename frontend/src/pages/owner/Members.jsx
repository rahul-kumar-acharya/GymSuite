import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Plus, Search, Filter, Phone, Mail, Calendar, ShieldCheck, X, RefreshCw, PauseCircle, Ban } from 'lucide-react';

export const Members = () => {
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [renewPlan, setRenewPlan] = useState('');
  const [renewError, setRenewError] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    gender: 'MALE',
    emergency_contact: '',
    notes: '',
    plan_id: ''
  });

  useEffect(() => {
    fetchMembers();
    fetchPlans();
  }, [search, statusFilter]);

  const fetchMembers = async () => {
    try {
      let url = '/members/';
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await api.get(url);
      setMembers(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await api.get('/memberships/plans/');
      setPlans(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      await api.post('/members/onboard/', {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        emergency_contact: formData.emergency_contact,
        notes: formData.notes,
        plan: formData.plan_id ? Number(formData.plan_id) : null,
      });

      setShowAddModal(false);
      setFormData({ full_name: '', email: '', phone: '', gender: 'MALE', emergency_contact: '', notes: '', plan_id: '' });
      fetchMembers();
    } catch (err) {
      const detail = err.response?.data;
      setFormError(detail?.detail || detail?.message || 'Failed to add member. Please review the form and try again.');
    } finally {
      setSaving(false);
    }
  };

  const renewMembership = async (event) => {
    event.preventDefault();
    const membershipId = selectedMember?.active_membership?.id;
    if (!membershipId || !renewPlan) return;
    try {
      await api.post(`/memberships/assigned/${membershipId}/renew/`, { plan: Number(renewPlan), payment_method: 'UPI' });
      setSelectedMember(null);
      setRenewPlan('');
      fetchMembers();
    } catch (err) {
      setRenewError(err.response?.data?.detail || 'Renewal failed.');
    }
  };

  const updateMembership = async (action, member) => {
    const membershipId = member.active_membership?.id;
    if (!membershipId) return;
    try {
      if (action === 'freeze') {
        const frozenUntil = window.prompt('Freeze until (YYYY-MM-DD):');
        if (!frozenUntil) return;
        await api.post(`/memberships/assigned/${membershipId}/freeze/`, { frozen_until: frozenUntil });
      } else {
        const reason = window.prompt('Cancellation reason (optional):') || '';
        await api.post(`/memberships/assigned/${membershipId}/cancel/`, { reason });
      }
      fetchMembers();
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Membership update failed.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-espresso-800">Member Directory</h1>
          <p className="text-xs text-mutedGray">Manage profiles, memberships, and active statuses</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-espresso-800 text-cream-100 text-sm font-bold shadow-md hover:bg-espresso-900 transition-all"
        >
          <Plus className="w-4 h-4 text-brass-400" />
          <span>Add New Member</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-sand shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-mutedGray absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, or GM code..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-sand bg-cream-50 text-xs focus:outline-none focus:border-brass-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${!statusFilter ? 'bg-espresso-800 text-cream-100' : 'bg-cream-100 text-mutedGray hover:text-espresso-800'}`}
          >
            All Members
          </button>
          <button
            onClick={() => setStatusFilter('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${statusFilter === 'ACTIVE' ? 'bg-statusGreen-bg text-statusGreen-text' : 'bg-cream-100 text-mutedGray'}`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter('EXPIRED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${statusFilter === 'EXPIRED' ? 'bg-statusRed-bg text-statusRed-text' : 'bg-cream-100 text-mutedGray'}`}
          >
            Expired
          </button>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-sand overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100/70 border-b border-sand text-espresso-800 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Member Code & Name</th>
                <th className="p-4">Phone / Contact</th>
                <th className="p-4">Active Plan</th>
                <th className="p-4">Days Left</th>
                <th className="p-4">Status</th>
                <th className="p-4">Total Paid</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand text-charcoal">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-mutedGray">Loading member database...</td>
                </tr>
              ) : members.length > 0 ? (
                members.map((m) => (
                  <tr key={m.id} className="hover:bg-cream-50 transition-colors">
                    <td className="p-4 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-espresso-800 text-brass-400 flex items-center justify-center font-bold">
                          {m.full_name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-espresso-800 text-sm">{m.full_name}</p>
                          <span className="font-mono text-[10px] text-brass-600 font-semibold">{m.member_id_code}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold">{m.phone}</p>
                      <span className="text-[10px] text-mutedGray">{m.email || 'No email registered'}</span>
                    </td>
                    <td className="p-4 font-semibold text-espresso-800">
                      {m.active_membership?.plan_name || <span className="text-mutedGray italic">No Active Plan</span>}
                    </td>
                    <td className="p-4 font-mono font-bold">
                      {m.active_membership ? `${m.active_membership.days_remaining} days` : '0 days'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        m.status === 'ACTIVE' ? 'bg-statusGreen-bg text-statusGreen-text' : 'bg-statusRed-bg text-statusRed-text'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-espresso-800">
                      ₹{m.total_paid || '0.00'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button type="button" title="Renew membership" aria-label={`Renew ${m.full_name}`} onClick={() => { setSelectedMember(m); setRenewError(''); }} className="rounded-lg p-2 text-brass-600 hover:bg-cream-100"><RefreshCw className="h-4 w-4" /></button>
                        <button type="button" title="Freeze membership" aria-label={`Freeze ${m.full_name}`} onClick={() => updateMembership('freeze', m)} className="rounded-lg p-2 text-espresso-700 hover:bg-cream-100"><PauseCircle className="h-4 w-4" /></button>
                        <button type="button" title="Cancel membership" aria-label={`Cancel ${m.full_name}`} onClick={() => updateMembership('cancel', m)} className="rounded-lg p-2 text-statusRed-text hover:bg-statusRed-bg"><Ban className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-mutedGray">No members found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-900/60 backdrop-blur-xs" role="dialog" aria-modal="true" aria-labelledby="add-member-title">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-sand space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-sand pb-4">
              <h3 id="add-member-title" className="font-heading text-xl font-bold text-espresso-800">Add New Gym Member</h3>
              <button onClick={() => setShowAddModal(false)} className="text-mutedGray hover:text-espresso-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              {formError && <div className="rounded-xl bg-statusRed-bg px-4 py-3 text-xs font-semibold text-statusRed-text">{formError}</div>}
              <div>
                <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-sand bg-cream-50 text-xs font-medium"
                  placeholder="e.g. Amit Verma"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-sand bg-cream-50 text-xs font-medium"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-sand bg-cream-50 text-xs font-medium"
                    placeholder="amit@gmail.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-sand bg-cream-50 text-xs font-medium"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Initial Membership Plan</label>
                  <select
                    value={formData.plan_id}
                    onChange={(e) => setFormData({ ...formData, plan_id: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-sand bg-cream-50 text-xs font-medium"
                  >
                    <option value="">Select Plan (Optional)</option>
                    {plans.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - ₹{p.price} ({p.duration_days}d)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={formData.emergency_contact}
                  onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-sand bg-cream-50 text-xs font-medium"
                  placeholder="Parent / Spouse Phone"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/3 py-2.5 rounded-xl border border-sand text-xs font-bold text-espresso-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-2/3 py-2.5 rounded-xl bg-espresso-800 text-cream-100 text-xs font-bold shadow-md hover:bg-espresso-900"
                >
                  {saving ? 'Saving member...' : 'Save Member & Provision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-espresso-900/60 p-4" role="dialog" aria-modal="true" aria-labelledby="renew-member-title">
          <form onSubmit={renewMembership} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between"><h3 id="renew-member-title" className="font-heading text-xl font-bold text-espresso-800">Renew {selectedMember.full_name}</h3><button type="button" aria-label="Close renewal dialog" onClick={() => setSelectedMember(null)}><X className="h-5 w-5" /></button></div>
            {renewError && <p className="rounded-lg bg-statusRed-bg p-3 text-xs font-semibold text-statusRed-text">{renewError}</p>}
            <label className="block text-xs font-bold uppercase text-espresso-800">Plan<select required value={renewPlan} onChange={(event) => setRenewPlan(event.target.value)} className="mt-1 w-full rounded-xl border border-sand px-3 py-2 text-sm"><option value="">Select plan</option>{plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name} - ₹{plan.price}</option>)}</select></label>
            <button className="w-full rounded-xl bg-espresso-800 py-3 text-xs font-bold text-cream-100">Renew and record payment</button>
          </form>
        </div>
      )}

    </div>
  );
};

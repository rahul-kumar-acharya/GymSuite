import React, { useEffect, useState } from 'react';
import { Check, Crown, Edit3, Plus, Power, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import { ConfirmDialog } from '../../components/ActionDialogs';

const emptyPlan = { name: '', slug: '', price_monthly: '', max_members: 100, description: '', is_active: true };

export const AdminSubscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [form, setForm] = useState(emptyPlan);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmPlan, setConfirmPlan] = useState(null);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/subscriptions/plans/');
      setPlans(response.data.results || response.data);
      setError('');
    } catch {
      setError('Subscription plans could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlans(); }, []);

  const openCreate = () => {
    setSelectedPlan(null);
    setForm(emptyPlan);
    setShowForm(true);
    setError('');
    setNotice('');
  };

  const openEdit = (plan) => {
    setSelectedPlan(plan);
    setForm({ ...plan, price_monthly: plan.price_monthly, max_members: plan.max_members });
    setShowForm(true);
    setError('');
    setNotice('');
  };

  const closeForm = () => {
    setSelectedPlan(null);
    setForm(emptyPlan);
    setShowForm(false);
    setError('');
  };

  const savePlan = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, price_monthly: Number(form.price_monthly), max_members: Number(form.max_members) };
      if (selectedPlan) await api.patch(`/subscriptions/plans/${selectedPlan.id}/`, payload);
      else await api.post('/subscriptions/plans/', payload);
      closeForm();
      setNotice(selectedPlan ? 'Plan updated successfully.' : 'Plan created successfully.');
      await fetchPlans();
    } catch (requestError) {
      const data = requestError.response?.data || {};
      setError(data.slug?.[0] || data.name?.[0] || data.price_monthly?.[0] || data.max_members?.[0] || data.detail || 'Plan could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const togglePlan = async (plan) => {
    try {
      await api.patch(`/subscriptions/plans/${plan.id}/`, { is_active: !plan.is_active });
      setNotice(`${plan.name} is now ${plan.is_active ? 'inactive' : 'active'}.`);
      fetchPlans();
    } catch {
      setError('Plan status could not be updated.');
    }
  };

  const deletePlan = async (plan, execute = false) => {
    if (!execute) {
      setConfirmPlan(plan);
      return;
    }
    try {
      await api.delete(`/subscriptions/plans/${plan.id}/`);
      setNotice(`${plan.name} was deleted.`);
      fetchPlans();
    } catch {
      setError('Plan could not be deleted. Deactivate it instead if it is in use.');
    } finally {
      setConfirmPlan(null);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brass-600">Platform billing</p>
          <h1 className="mt-1 font-heading text-2xl font-bold text-espresso-800 sm:text-3xl">SaaS plan manager</h1>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-mutedGray">Create and tune the subscription tiers available to every GymSuite tenant.</p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-espresso-800 px-4 py-3 text-xs font-bold text-cream-100 shadow-md"><Plus className="h-4 w-4 text-brass-400" /> Create plan</button>
      </header>

      {notice && <div role="status" className="flex items-center gap-2 rounded-xl bg-statusGreen-bg p-4 text-xs font-semibold text-statusGreen-text"><Check className="h-4 w-4" />{notice}</div>}
      {error && !selectedPlan && <div role="alert" className="rounded-xl bg-statusRed-bg p-4 text-xs font-semibold text-statusRed-text">{error}</div>}

      {loading ? <div className="rounded-2xl border border-dashed border-sand bg-white p-10 text-center text-xs text-mutedGray">Loading subscription plans...</div> : plans.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{plans.map((plan) => <article key={plan.id} className={`flex flex-col rounded-2xl border bg-white p-5 shadow-xs ${plan.is_active ? 'border-sand' : 'border-dashed border-mutedGray/40 opacity-70'}`}><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><span className="rounded-lg bg-cream-100 p-2 text-brass-600"><Crown className="h-4 w-4" /></span><h2 className="font-heading text-xl font-bold text-espresso-800">{plan.name}</h2></div><p className="mt-2 break-all text-[10px] font-semibold uppercase tracking-wider text-mutedGray">{plan.slug}</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${plan.is_active ? 'bg-statusGreen-bg text-statusGreen-text' : 'bg-cream-200 text-mutedGray'}`}>{plan.is_active ? 'Active' : 'Inactive'}</span></div><div className="mt-5 flex items-baseline gap-1"><span className="font-heading text-3xl font-bold text-espresso-800">₹{plan.price_monthly}</span><span className="text-xs text-mutedGray">/month</span></div><p className="mt-3 min-h-10 text-xs leading-5 text-mutedGray">{plan.description || 'No description provided.'}</p><div className="mt-5 border-t border-sand pt-4 text-xs font-bold text-brass-600">Max members: {plan.max_members === -1 ? 'Unlimited' : plan.max_members}</div><div className="mt-5 flex gap-2 border-t border-sand pt-4"><button type="button" onClick={() => openEdit(plan)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-sand px-3 py-2 text-xs font-bold text-espresso-800 hover:bg-cream-50"><Edit3 className="h-3.5 w-3.5" /> Edit</button><button type="button" onClick={() => togglePlan(plan)} aria-label={`${plan.is_active ? 'Deactivate' : 'Activate'} ${plan.name}`} className="rounded-lg border border-sand p-2 text-brass-600 hover:bg-cream-50"><Power className="h-4 w-4" /></button><button type="button" onClick={() => deletePlan(plan)} aria-label={`Delete ${plan.name}`} className="rounded-lg border border-sand p-2 text-statusRed-text hover:bg-statusRed-bg"><Trash2 className="h-4 w-4" /></button></div></article>)}</div> : <div className="rounded-2xl border border-dashed border-sand bg-white p-10 text-center text-xs text-mutedGray">No plans exist yet. Create your first subscription tier.</div>}

      {showForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-espresso-900/60 p-4" role="dialog" aria-modal="true" aria-labelledby="plan-dialog-title"><form onSubmit={savePlan} className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-xl"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-wider text-brass-600">{selectedPlan ? 'Edit tier' : 'New tier'}</p><h2 id="plan-dialog-title" className="font-heading text-xl font-bold text-espresso-800">{selectedPlan ? 'Update subscription plan' : 'Create subscription plan'}</h2></div><button type="button" aria-label="Close plan dialog" onClick={closeForm}><X className="h-5 w-5 text-mutedGray" /></button></div>{error && <p role="alert" className="rounded-xl bg-statusRed-bg p-3 text-xs font-semibold text-statusRed-text">{error}</p>}<div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold text-espresso-800">Plan name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1 w-full rounded-xl border border-sand bg-cream-50 px-3 py-2.5 text-sm" placeholder="Professional" /></label><label className="text-xs font-bold text-espresso-800">Slug<input required value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} className="mt-1 w-full rounded-xl border border-sand bg-cream-50 px-3 py-2.5 text-sm" placeholder="professional" /></label></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold text-espresso-800">Monthly price<input required min="0" step="0.01" type="number" value={form.price_monthly} onChange={(event) => setForm({ ...form, price_monthly: event.target.value })} className="mt-1 w-full rounded-xl border border-sand bg-cream-50 px-3 py-2.5 text-sm" placeholder="999" /></label><label className="text-xs font-bold text-espresso-800">Member limit<input required min="-1" type="number" value={form.max_members} onChange={(event) => setForm({ ...form, max_members: event.target.value })} className="mt-1 w-full rounded-xl border border-sand bg-cream-50 px-3 py-2.5 text-sm" placeholder="-1 for unlimited" /></label></div><label className="block text-xs font-bold text-espresso-800">Description<textarea rows="3" value={form.description || ''} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-1 w-full rounded-xl border border-sand bg-cream-50 px-3 py-2.5 text-sm" placeholder="Describe who this plan is for." /></label><label className="flex items-center gap-2 text-xs font-bold text-espresso-800"><input type="checkbox" checked={Boolean(form.is_active)} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} className="h-4 w-4 accent-[#B08D57]" /> Available to customers</label><button disabled={saving} className="w-full rounded-xl bg-espresso-800 py-3 text-xs font-bold text-cream-100">{saving ? 'Saving plan...' : selectedPlan ? 'Save changes' : 'Create plan'}</button></form></div>}
      <ConfirmDialog open={Boolean(confirmPlan)} title={`Delete ${confirmPlan?.name || 'plan'}?`} description="This permanently removes the plan. Existing gym subscriptions will keep their history, but this plan will no longer be selectable." confirmLabel="Delete plan" danger onCancel={() => setConfirmPlan(null)} onConfirm={() => deletePlan(confirmPlan, true)} />
    </div>
  );
};

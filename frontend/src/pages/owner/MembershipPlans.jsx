import React, { useEffect, useState } from 'react';
import { Check, CreditCard, Edit3, Plus, Power, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import { ConfirmDialog } from '../../components/ActionDialogs';

const emptyPlan = { name: '', duration_days: 30, price: '', description: '', is_active: true };

export const MembershipPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [confirmPlan, setConfirmPlan] = useState(null);
  const [form, setForm] = useState(emptyPlan);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const fetchPlans = async () => {
    try {
      const response = await api.get('/memberships/plans/');
      setPlans(response.data.results || response.data);
      setError('');
    } catch {
      setError('Membership plans could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlans(); }, []);

  const openCreate = () => { setSelectedPlan(null); setForm(emptyPlan); setShowForm(true); setError(''); };
  const openEdit = (plan) => { setSelectedPlan(plan); setForm({ name: plan.name, duration_days: plan.duration_days, price: plan.price, description: plan.description || '', is_active: plan.is_active }); setShowForm(true); setError(''); };
  const closeForm = () => { setShowForm(false); setSelectedPlan(null); setForm(emptyPlan); };

  const savePlan = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, duration_days: Number(form.duration_days), price: Number(form.price) };
      if (selectedPlan) await api.patch(`/memberships/plans/${selectedPlan.id}/`, payload);
      else await api.post('/memberships/plans/', payload);
      closeForm();
      setNotice(selectedPlan ? 'Membership plan updated.' : 'Membership plan created.');
      fetchPlans();
    } catch (requestError) {
      const data = requestError.response?.data || {};
      setError(data.detail || data.duration_days?.[0] || data.price?.[0] || 'Membership plan could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const togglePlan = async (plan) => {
    try {
      await api.patch(`/memberships/plans/${plan.id}/`, { is_active: !plan.is_active });
      setNotice(`${plan.name} is now ${plan.is_active ? 'inactive' : 'active'}.`);
      fetchPlans();
    } catch {
      setError('Membership plan status could not be updated.');
    }
  };

  const deletePlan = async () => {
    try {
      await api.delete(`/memberships/plans/${confirmPlan.id}/`);
      setNotice(`${confirmPlan.name} was deleted.`);
      setConfirmPlan(null);
      fetchPlans();
    } catch {
      setError('This plan could not be deleted. Deactivate it instead if it is already in use.');
      setConfirmPlan(null);
    }
  };

  return <div className="space-y-6"><header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brass-600">Gym operations</p><h1 className="mt-1 font-heading text-2xl font-bold text-espresso-800 sm:text-3xl">Membership plans</h1><p className="mt-1 text-xs text-mutedGray">Create, edit, pause, or remove the plans your gym sells to members.</p></div><button type="button" onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-espresso-800 px-4 py-3 text-xs font-bold text-cream-100"><Plus className="h-4 w-4 text-brass-400" /> Create plan</button></header>{notice && <div role="status" className="flex items-center gap-2 rounded-xl bg-statusGreen-bg p-4 text-xs font-semibold text-statusGreen-text"><Check className="h-4 w-4" />{notice}</div>}{error && !showForm && <div role="alert" className="rounded-xl bg-statusRed-bg p-4 text-xs font-semibold text-statusRed-text">{error}</div>}{loading ? <div className="rounded-2xl border border-dashed border-sand bg-white p-10 text-center text-xs text-mutedGray">Loading membership plans...</div> : plans.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{plans.map((plan) => <article key={plan.id} className={`flex flex-col rounded-2xl border bg-white p-6 shadow-xs ${plan.is_active ? 'border-sand' : 'border-dashed border-mutedGray/40 opacity-70'}`}><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2"><span className="rounded-xl bg-cream-100 p-2 text-brass-600"><CreditCard className="h-4 w-4" /></span><h2 className="font-heading text-xl font-bold text-espresso-800">{plan.name}</h2></div><span className={`rounded-full px-3 py-1 text-[10px] font-bold ${plan.is_active ? 'bg-statusGreen-bg text-statusGreen-text' : 'bg-cream-200 text-mutedGray'}`}>{plan.is_active ? 'Active' : 'Inactive'}</span></div><p className="mt-4 min-h-10 text-xs leading-5 text-mutedGray">{plan.description || 'Standard gym access plan.'}</p><p className="mt-4 font-heading text-3xl font-bold text-espresso-800">₹{plan.price}<span className="ml-1 text-xs font-sans font-normal text-mutedGray">/duration</span></p><div className="mt-4 border-t border-sand pt-4 text-xs font-bold text-brass-600">{plan.duration_days} days access</div><div className="mt-5 flex gap-2 border-t border-sand pt-4"><button type="button" onClick={() => openEdit(plan)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-sand px-3 py-2 text-xs font-bold text-espresso-800"><Edit3 className="h-3.5 w-3.5" /> Edit</button><button type="button" onClick={() => togglePlan(plan)} aria-label={`${plan.is_active ? 'Deactivate' : 'Activate'} ${plan.name}`} className="rounded-lg border border-sand p-2 text-brass-600"><Power className="h-4 w-4" /></button><button type="button" onClick={() => setConfirmPlan(plan)} aria-label={`Delete ${plan.name}`} className="rounded-lg border border-sand p-2 text-statusRed-text"><Trash2 className="h-4 w-4" /></button></div></article>)}</div> : <div className="rounded-2xl border border-dashed border-sand bg-white p-10 text-center text-xs text-mutedGray">No plans configured yet. Create your first plan.</div>}

    {showForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-espresso-900/60 p-4" role="dialog" aria-modal="true" aria-labelledby="membership-plan-title"><form onSubmit={savePlan} className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-xl"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-wider text-brass-600">{selectedPlan ? 'Edit plan' : 'New plan'}</p><h2 id="membership-plan-title" className="font-heading text-xl font-bold text-espresso-800">{selectedPlan ? 'Update membership plan' : 'Create membership plan'}</h2></div><button type="button" aria-label="Close plan dialog" onClick={closeForm}><X className="h-5 w-5 text-mutedGray" /></button></div>{error && <p role="alert" className="rounded-xl bg-statusRed-bg p-3 text-xs font-semibold text-statusRed-text">{error}</p>}<label className="block text-xs font-bold text-espresso-800">Plan name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1 w-full rounded-xl border border-sand bg-cream-50 px-4 py-3 text-sm" placeholder="Quarterly Transformation" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold text-espresso-800">Duration in days<input required min="1" type="number" value={form.duration_days} onChange={(event) => setForm({ ...form, duration_days: event.target.value })} className="mt-1 w-full rounded-xl border border-sand bg-cream-50 px-4 py-3 text-sm" /></label><label className="text-xs font-bold text-espresso-800">Price<input required min="0" step="0.01" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="mt-1 w-full rounded-xl border border-sand bg-cream-50 px-4 py-3 text-sm" /></label></div><label className="block text-xs font-bold text-espresso-800">Description<textarea rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-1 w-full rounded-xl border border-sand bg-cream-50 px-4 py-3 text-sm" /></label><label className="flex items-center gap-2 text-xs font-bold text-espresso-800"><input type="checkbox" checked={Boolean(form.is_active)} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} className="h-4 w-4 accent-[#B08D57]" /> Available for new memberships</label><button disabled={saving} className="w-full rounded-xl bg-espresso-800 py-3 text-xs font-bold text-cream-100">{saving ? 'Saving...' : selectedPlan ? 'Save changes' : 'Create plan'}</button></form></div>}
    <ConfirmDialog open={Boolean(confirmPlan)} title={`Delete ${confirmPlan?.name || 'plan'}?`} description="This removes the gym membership plan. Existing memberships keep their history." confirmLabel="Delete plan" danger onCancel={() => setConfirmPlan(null)} onConfirm={deletePlan} />
  </div>;
};

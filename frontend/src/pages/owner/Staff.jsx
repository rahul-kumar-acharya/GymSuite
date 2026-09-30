import React, { useEffect, useState } from 'react';
import { Mail, Plus, ShieldCheck, X } from 'lucide-react';
import api from '../../services/api';

export const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', role: 'STAFF', password: '' });

  const loadStaff = async () => {
    const response = await api.get('/auth/staff/');
    setStaff(response.data.results || response.data);
  };

  useEffect(() => {
    loadStaff().catch(() => setError('Staff accounts could not be loaded.'));
  }, []);

  const createStaff = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/auth/staff/', form);
      setForm({ first_name: '', last_name: '', email: '', phone: '', role: 'STAFF', password: '' });
      setShowForm(false);
      await loadStaff();
    } catch (err) {
      setError(err.response?.data?.email?.[0] || err.response?.data?.detail || 'Staff account could not be created.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4"><div><h1 className="font-heading text-2xl font-bold text-espresso-800">Staff Management</h1><p className="text-xs text-mutedGray">Create and manage owner-controlled gym access.</p></div><button type="button" onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-xl bg-espresso-800 px-4 py-2.5 text-xs font-bold text-cream-100"><Plus className="h-4 w-4 text-brass-400" /> Add staff</button></div>
      {error && <div className="rounded-xl bg-statusRed-bg px-4 py-3 text-xs font-semibold text-statusRed-text">{error}</div>}
      <div className="grid gap-4 md:grid-cols-2">{staff.map((person) => <div key={person.id} className="rounded-2xl border border-sand bg-white p-5 shadow-xs"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-espresso-800 font-bold text-brass-400">{person.first_name?.[0] || 'S'}</div><div className="min-w-0"><p className="truncate text-sm font-bold text-espresso-800">{person.first_name} {person.last_name}</p><p className="flex items-center gap-1 text-xs text-mutedGray"><Mail className="h-3 w-3" />{person.email}</p></div><span className="ml-auto rounded-full bg-cream-100 px-2.5 py-1 text-[10px] font-bold text-brass-600">{person.role}</span></div></div>)}{!staff.length && <p className="rounded-2xl border border-dashed border-sand p-8 text-center text-xs text-mutedGray">No staff accounts yet.</p>}</div>
      {showForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-espresso-900/60 p-4"><form onSubmit={createStaff} className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-xl"><div className="flex items-center justify-between"><h2 className="font-heading text-xl font-bold text-espresso-800">Create staff account</h2><button type="button" aria-label="Close" onClick={() => setShowForm(false)}><X className="h-5 w-5" /></button></div><div className="grid grid-cols-2 gap-3"><input required placeholder="First name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className="rounded-xl border border-sand px-3 py-2 text-sm" /><input placeholder="Last name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className="rounded-xl border border-sand px-3 py-2 text-sm" /></div><input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-sand px-3 py-2 text-sm" /><input required minLength="6" type="password" placeholder="Temporary password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-sand px-3 py-2 text-sm" /><input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-xl border border-sand px-3 py-2 text-sm" /><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-xl border border-sand px-3 py-2 text-sm"><option value="STAFF">Staff</option><option value="MANAGER">Manager</option></select><button disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-espresso-800 py-3 text-xs font-bold text-cream-100"><ShieldCheck className="h-4 w-4 text-brass-400" />{saving ? 'Creating...' : 'Create account'}</button></form></div>}
    </div>
  );
};

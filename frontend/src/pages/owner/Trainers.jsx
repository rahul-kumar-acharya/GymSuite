import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { UserCog, Plus, Dumbbell, ShieldCheck, Mail, Phone, X, UserPlus } from 'lucide-react';

export const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', specialization: '', salary_monthly: '' });

  useEffect(() => {
    fetchTrainers();
    api.get('/members/').then((res) => setMembers(res.data.results || res.data)).catch(() => {});
  }, []);

  const fetchTrainers = async () => {
    try {
      const res = await api.get('/trainers/');
      setTrainers(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createTrainer = async (event) => {
    event.preventDefault();
    try {
      await api.post('/trainers/', form);
      setShowForm(false);
      setForm({ full_name: '', email: '', phone: '', password: '', specialization: '', salary_monthly: '' });
      fetchTrainers();
    } catch (err) {
      setError(err.response?.data?.detail || 'Trainer could not be created.');
    }
  };

  const assignMember = async (trainerId, memberId) => {
    if (!memberId) return;
    await api.post(`/trainers/${trainerId}/assign/`, { member_id: Number(memberId) });
    fetchTrainers();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-espresso-800">Trainer Management</h1>
        <p className="text-xs text-mutedGray">Manage gym trainers, specializations, monthly salaries, and client roster</p>
      </div>
      <div className="flex justify-end"><button type="button" onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-xl bg-espresso-800 px-4 py-2.5 text-xs font-bold text-cream-100"><Plus className="h-4 w-4 text-brass-400" /> Add trainer</button></div>
      {error && <p className="rounded-xl bg-statusRed-bg p-3 text-xs font-semibold text-statusRed-text">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-xs text-mutedGray col-span-3 text-center py-12">Loading trainers...</p>
        ) : trainers.length > 0 ? (
          trainers.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl p-6 border border-sand shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-espresso-800 text-brass-400 flex items-center justify-center font-bold text-lg">
                  {t.trainer_name ? t.trainer_name[0] : 'T'}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-espresso-800">{t.trainer_name || 'Trainer'}</h3>
                  <span className="text-[10px] font-bold text-brass-600 uppercase tracking-wider">{t.specialization}</span>
                </div>
              </div>

              <div className="text-xs space-y-1 text-mutedGray border-t border-sand pt-3">
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-brass-500" />
                  <span>{t.trainer_email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-brass-500" />
                  <span>{t.trainer_phone || 'No phone'}</span>
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-sand pt-3 text-xs">
                <span className="text-mutedGray">Assigned Clients: <span className="font-bold text-espresso-800">{t.assigned_members_count}</span></span>
                <span className="font-bold text-statusGreen-text bg-statusGreen-bg px-2.5 py-1 rounded-md">₹{t.salary_monthly}/mo</span>
              </div>
              <div className="border-t border-sand pt-3"><label className="text-[10px] font-bold uppercase text-mutedGray">Assign member<select onChange={(event) => assignMember(t.id, event.target.value)} className="mt-1 w-full rounded-lg border border-sand px-2 py-2 text-xs"><option value="">Choose member</option>{members.filter((member) => !(t.assigned_members || []).includes(member.id)).map((member) => <option key={member.id} value={member.id}>{member.full_name} ({member.member_id_code})</option>)}</select></label></div>
            </div>
          ))
        ) : (
          <p className="text-xs text-mutedGray col-span-3 text-center py-12">No trainers registered yet.</p>
        )}
      </div>
      {showForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-espresso-900/60 p-4"><form onSubmit={createTrainer} className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-xl"><div className="flex items-center justify-between"><h2 className="font-heading text-xl font-bold text-espresso-800">Create trainer account</h2><button type="button" aria-label="Close" onClick={() => setShowForm(false)}><X className="h-5 w-5" /></button></div><input required placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full rounded-xl border border-sand px-3 py-2 text-sm" /><input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-sand px-3 py-2 text-sm" /><input required minLength="6" type="password" placeholder="Temporary password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-sand px-3 py-2 text-sm" /><input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-xl border border-sand px-3 py-2 text-sm" /><input placeholder="Specialization" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="w-full rounded-xl border border-sand px-3 py-2 text-sm" /><button className="w-full rounded-xl bg-espresso-800 py-3 text-xs font-bold text-cream-100">Create trainer</button></form></div>}
    </div>
  );
};

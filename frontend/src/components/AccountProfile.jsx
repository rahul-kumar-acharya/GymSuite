import React, { useEffect, useState } from 'react';
import { CheckCircle2, KeyRound, Save, UserRound } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const initialPassword = { current_password: '', new_password: '', confirm_password: '' };

export const AccountProfile = ({ title = 'My Profile', subtitle = 'Keep your account details current and secure.' }) => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [password, setPassword] = useState(initialPassword);
  const [activeTab, setActiveTab] = useState('profile');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/auth/profile/').then((response) => setProfile(response.data)).catch(() => setStatus({ type: 'error', message: 'Profile could not be loaded.' }));
  }, []);

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus({ type: '', message: '' });
    try {
      const response = await api.patch('/auth/profile/', {
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone: profile.phone || '',
      });
      setProfile(response.data);
      updateUser({ ...JSON.parse(localStorage.getItem('gymsuite_user') || '{}'), ...response.data });
      setStatus({ type: 'success', message: 'Profile details saved.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.email?.[0] || 'Profile could not be saved.' });
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus({ type: '', message: '' });
    try {
      await api.post('/auth/change-password/', password);
      setPassword(initialPassword);
      setStatus({ type: 'success', message: 'Password updated successfully.' });
    } catch (error) {
      const data = error.response?.data || {};
      setStatus({ type: 'error', message: data.current_password?.[0] || data.confirm_password?.[0] || data.new_password?.[0] || 'Password could not be updated.' });
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <div className="p-8 text-center text-xs text-mutedGray">Loading profile...</div>;

  return <section className="mx-auto max-w-3xl space-y-6">
    <header><p className="text-[10px] font-bold uppercase tracking-wider text-brass-600">Account center</p><h1 className="font-heading text-2xl font-bold text-espresso-800 sm:text-3xl">{title}</h1><p className="mt-1 text-xs text-mutedGray">{subtitle}</p></header>
    <div className="overflow-hidden rounded-3xl border border-sand bg-white shadow-xs">
      <div className="flex border-b border-sand bg-cream-50 p-2"><button type="button" onClick={() => setActiveTab('profile')} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-bold ${activeTab === 'profile' ? 'bg-espresso-800 text-cream-100' : 'text-mutedGray'}`}><UserRound className="h-4 w-4" /> Profile details</button><button type="button" onClick={() => setActiveTab('password')} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-bold ${activeTab === 'password' ? 'bg-espresso-800 text-cream-100' : 'text-mutedGray'}`}><KeyRound className="h-4 w-4" /> Password</button></div>
      <div className="p-5 sm:p-8">
        {status.message && <div role="status" className={`mb-5 flex items-center gap-2 rounded-xl p-4 text-xs font-semibold ${status.type === 'success' ? 'bg-statusGreen-bg text-statusGreen-text' : 'bg-statusRed-bg text-statusRed-text'}`}>{status.type === 'success' && <CheckCircle2 className="h-4 w-4" />}{status.message}</div>}
        {activeTab === 'profile' ? <form onSubmit={saveProfile} className="space-y-5"><div className="flex items-center gap-4 rounded-2xl bg-cream-50 p-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-espresso-800 text-xl font-bold text-brass-400">{profile.first_name?.[0] || profile.email?.[0]?.toUpperCase() || 'U'}</div><div><p className="text-sm font-bold text-espresso-800">{profile.first_name} {profile.last_name}</p><p className="text-xs text-mutedGray">{profile.role} · {profile.gym_name || 'Platform account'}</p></div></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold text-espresso-800">First name<input required value={profile.first_name || ''} onChange={(event) => setProfile({ ...profile, first_name: event.target.value })} className="mt-1 w-full rounded-xl border border-sand bg-cream-50 px-4 py-3 text-sm font-medium" /></label><label className="text-xs font-bold text-espresso-800">Last name<input value={profile.last_name || ''} onChange={(event) => setProfile({ ...profile, last_name: event.target.value })} className="mt-1 w-full rounded-xl border border-sand bg-cream-50 px-4 py-3 text-sm font-medium" /></label></div><label className="block text-xs font-bold text-espresso-800">Email address<input required type="email" value={profile.email || ''} onChange={(event) => setProfile({ ...profile, email: event.target.value })} className="mt-1 w-full rounded-xl border border-sand bg-cream-50 px-4 py-3 text-sm font-medium" /></label><label className="block text-xs font-bold text-espresso-800">Phone number<input value={profile.phone || ''} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} className="mt-1 w-full rounded-xl border border-sand bg-cream-50 px-4 py-3 text-sm font-medium" /></label><button disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-espresso-800 px-5 py-3 text-xs font-bold text-cream-100"><Save className="h-4 w-4 text-brass-400" />{saving ? 'Saving...' : 'Save profile'}</button></form> : <form onSubmit={changePassword} className="space-y-5"><div className="rounded-2xl border border-brass-400/30 bg-statusAmber-bg p-4 text-xs text-statusAmber-text">Enter your current password first. Your new password must be at least eight characters and different from the current one.</div><label className="block text-xs font-bold text-espresso-800">Current password<input required type="password" value={password.current_password} onChange={(event) => setPassword({ ...password, current_password: event.target.value })} className="mt-1 w-full rounded-xl border border-sand bg-cream-50 px-4 py-3 text-sm" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold text-espresso-800">New password<input required minLength="8" type="password" value={password.new_password} onChange={(event) => setPassword({ ...password, new_password: event.target.value })} className="mt-1 w-full rounded-xl border border-sand bg-cream-50 px-4 py-3 text-sm" /></label><label className="text-xs font-bold text-espresso-800">Confirm new password<input required minLength="8" type="password" value={password.confirm_password} onChange={(event) => setPassword({ ...password, confirm_password: event.target.value })} className="mt-1 w-full rounded-xl border border-sand bg-cream-50 px-4 py-3 text-sm" /></label></div><button disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-espresso-800 px-5 py-3 text-xs font-bold text-cream-100"><KeyRound className="h-4 w-4 text-brass-400" />{saving ? 'Updating...' : 'Update password'}</button></form>}
      </div>
    </div>
  </section>;
};
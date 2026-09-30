import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export const MemberProfile = () => {
  const [profile, setProfile] = useState(null);
  useEffect(() => { api.get('/members/me/').then((response) => setProfile(response.data)); }, []);
  return <section className="mx-auto max-w-2xl space-y-6"><header><h1 className="font-heading text-2xl font-bold text-espresso-800">My Profile</h1><p className="text-xs text-mutedGray">Your gym member information.</p></header><div className="rounded-2xl border border-sand bg-white p-6 shadow-xs"><dl className="grid gap-4 sm:grid-cols-2"><div><dt className="text-[10px] font-bold uppercase text-mutedGray">Name</dt><dd className="mt-1 text-sm font-semibold text-espresso-800">{profile?.full_name}</dd></div><div><dt className="text-[10px] font-bold uppercase text-mutedGray">Member code</dt><dd className="mt-1 text-sm font-semibold text-brass-600">{profile?.member_id_code}</dd></div><div><dt className="text-[10px] font-bold uppercase text-mutedGray">Phone</dt><dd className="mt-1 text-sm font-semibold text-espresso-800">{profile?.phone}</dd></div><div><dt className="text-[10px] font-bold uppercase text-mutedGray">Email</dt><dd className="mt-1 break-all text-sm font-semibold text-espresso-800">{profile?.email || 'Not added'}</dd></div></dl></div></section>;
};

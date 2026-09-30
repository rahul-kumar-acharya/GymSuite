import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export const TrainerMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/members/').then((response) => setMembers(response.data.results || response.data)).finally(() => setLoading(false)); }, []);
  return <section className="space-y-6"><header><h1 className="font-heading text-2xl font-bold text-espresso-800">Assigned Clients</h1><p className="text-xs text-mutedGray">Your current client roster and membership status.</p></header><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{loading ? <p className="text-xs text-mutedGray">Loading clients...</p> : members.length ? members.map((member) => <article key={member.id} className="rounded-2xl border border-sand bg-white p-5 shadow-xs"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-espresso-800 font-bold text-brass-400">{member.full_name?.[0]}</div><div className="min-w-0"><h2 className="truncate text-sm font-bold text-espresso-800">{member.full_name}</h2><p className="text-xs text-mutedGray">{member.member_id_code}</p></div></div><dl className="mt-4 space-y-2 border-t border-sand pt-4 text-xs"><div className="flex justify-between"><dt className="text-mutedGray">Phone</dt><dd className="font-semibold">{member.phone}</dd></div><div className="flex justify-between"><dt className="text-mutedGray">Status</dt><dd className="font-semibold text-brass-600">{member.status}</dd></div></dl></article>) : <p className="text-xs text-mutedGray">No assigned clients yet.</p>}</div></section>;
};

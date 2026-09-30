import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Users } from 'lucide-react';
import { PortalPageShell, PortalState, PortalSurface } from '../../components/PortalPageShell';

export const TrainerMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { api.get('/members/').then((response) => setMembers(response.data.results || response.data)).catch(() => setError('Assigned clients could not be loaded.')).finally(() => setLoading(false)); }, []);
  return <PortalPageShell eyebrow="Trainer workspace" title="Assigned clients" subtitle="A focused view of the members currently assigned to you."><PortalSurface><div className="mb-5 flex items-center justify-between border-b border-sand pb-4"><div><h2 className="font-heading text-lg font-bold text-espresso-800">Client roster</h2><p className="mt-1 text-xs text-mutedGray">{members.length} assigned member{members.length === 1 ? '' : 's'}</p></div><span className="rounded-xl bg-cream-100 p-3 text-brass-600"><Users className="h-5 w-5" /></span></div>{loading ? <PortalState>Loading client roster...</PortalState> : error ? <PortalState tone="error">{error}</PortalState> : members.length ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{members.map((member) => <article key={member.id} className="rounded-xl border border-sand bg-cream-50 p-4 transition-colors hover:border-brass-400"><div className="flex items-center gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-espresso-800 font-bold text-brass-400">{member.full_name?.[0]}</div><div className="min-w-0"><h3 className="truncate text-sm font-bold text-espresso-800">{member.full_name}</h3><p className="text-xs text-mutedGray">{member.member_id_code}</p></div></div><dl className="mt-4 space-y-2 border-t border-sand pt-3 text-xs"><div className="flex justify-between gap-3"><dt className="text-mutedGray">Phone</dt><dd className="truncate font-semibold text-espresso-800">{member.phone}</dd></div><div className="flex justify-between"><dt className="text-mutedGray">Status</dt><dd className="font-semibold text-brass-600">{member.status}</dd></div></dl></article>)}</div> : <PortalState>No assigned clients yet.</PortalState>}</PortalSurface></PortalPageShell>;
};

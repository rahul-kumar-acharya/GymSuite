import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { CalendarCheck } from 'lucide-react';
import { PortalPageShell, PortalState, PortalSurface } from '../../components/PortalPageShell';

export const MemberAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { api.get('/attendance/').then((response) => setAttendance(response.data.results || response.data)).catch(() => setError('Attendance history could not be loaded.')).finally(() => setLoading(false)); }, []);
  return <PortalPageShell eyebrow="Member workspace" title="Attendance history" subtitle="A simple view of your recent gym check-ins."><PortalSurface><div className="mb-5 flex items-center justify-between border-b border-sand pb-4"><div><h2 className="font-heading text-lg font-bold text-espresso-800">Recent check-ins</h2><p className="mt-1 text-xs text-mutedGray">Stay consistent and keep your momentum visible.</p></div><span className="rounded-xl bg-cream-100 p-3 text-brass-600"><CalendarCheck className="h-5 w-5" /></span></div>{loading ? <PortalState>Loading attendance history...</PortalState> : error ? <PortalState tone="error">{error}</PortalState> : attendance.length ? <div className="divide-y divide-sand">{attendance.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"><div><p className="font-bold text-espresso-800">{item.date}</p><p className="mt-1 text-xs text-mutedGray">Checked in at {item.check_in}</p></div><span className="rounded-full bg-cream-100 px-3 py-1 text-[10px] font-bold text-brass-600">{item.method}</span></div>)}</div> : <PortalState>No attendance records yet.</PortalState>}</PortalSurface></PortalPageShell>;
};

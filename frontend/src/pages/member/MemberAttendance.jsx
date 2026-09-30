import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export const MemberAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  useEffect(() => { api.get('/attendance/').then((response) => setAttendance(response.data.results || response.data)); }, []);
  return <section className="mx-auto max-w-2xl space-y-6"><header><h1 className="font-heading text-2xl font-bold text-espresso-800">Attendance History</h1><p className="text-xs text-mutedGray">Your recent gym check-ins.</p></header><div className="overflow-hidden rounded-2xl border border-sand bg-white shadow-xs">{attendance.length ? <div className="divide-y divide-sand">{attendance.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm"><div><p className="font-bold text-espresso-800">{item.date}</p><p className="text-xs text-mutedGray">Checked in at {item.check_in}</p></div><span className="rounded-full bg-cream-100 px-3 py-1 text-[10px] font-bold text-brass-600">{item.method}</span></div>)}</div> : <p className="p-8 text-center text-xs text-mutedGray">No attendance records yet.</p>}</div></section>;
};

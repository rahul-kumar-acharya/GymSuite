import React, { useEffect, useState } from 'react';
import { FileText, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

export const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/audit-logs/').then((response) => setLogs(response.data.results || response.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-espresso-800">System Activity Logs</h1>
        <p className="text-xs text-mutedGray">Audit trail of platform registrations, tenant provisioning, and system events</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-sand shadow-xs space-y-3 font-mono text-xs text-charcoal">
        {loading ? <p className="p-4 text-mutedGray">Loading activity...</p> : logs.length ? logs.map((log) => <div key={log.id} className="flex items-center justify-between rounded-xl border border-sand bg-cream-50 p-3"><span>[{log.action}] {log.entity} {log.entity_id || ''}</span><span className="text-mutedGray">{new Date(log.created_at).toLocaleString()}</span></div>) : <p className="p-4 text-mutedGray">No activity recorded yet.</p>}
      </div>
    </div>
  );
};

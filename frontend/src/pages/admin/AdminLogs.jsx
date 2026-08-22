import React from 'react';
import { FileText, ShieldCheck } from 'lucide-react';

export const AdminLogs = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-espresso-800">System Activity Logs</h1>
        <p className="text-xs text-mutedGray">Audit trail of platform registrations, tenant provisioning, and system events</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-sand shadow-xs space-y-3 font-mono text-xs text-charcoal">
        <div className="p-3 bg-cream-50 rounded-xl border border-sand flex items-center justify-between">
          <span>[SYSTEM] Platform initialized under AcharyaWorks ecosystem.</span>
          <span className="text-mutedGray">2026-08-22 17:25</span>
        </div>
        <div className="p-3 bg-cream-50 rounded-xl border border-sand flex items-center justify-between">
          <span>[TENANT] Demo Gym 'Hercules Health Club' provisioned with 30-Day Free Trial.</span>
          <span className="text-mutedGray">2026-08-22 17:49</span>
        </div>
        <div className="p-3 bg-cream-50 rounded-xl border border-sand flex items-center justify-between">
          <span>[AUTH] Super Admin account 'admin@gymsuite.in' authenticated.</span>
          <span className="text-mutedGray">2026-08-22 18:18</span>
        </div>
      </div>
    </div>
  );
};

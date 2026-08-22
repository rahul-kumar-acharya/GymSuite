import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Building2, Search, Edit2, ShieldAlert } from 'lucide-react';

export const AdminGyms = () => {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGyms();
  }, []);

  const fetchGyms = async () => {
    try {
      const res = await api.get('/gyms/superadmin/all-gyms/');
      setGyms(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (gymId, newStatus) => {
    try {
      await api.patch(`/gyms/superadmin/all-gyms/${gymId}/`, { status: newStatus });
      fetchGyms();
    } catch (err) {
      alert('Failed to update gym status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-espresso-800">All Registered Gyms</h1>
        <p className="text-xs text-mutedGray">Manage tenant accounts, update SaaS statuses (Trial, Active, Suspended)</p>
      </div>

      <div className="bg-white rounded-2xl border border-sand overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100/70 border-b border-sand text-espresso-800 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Gym Name & Prefix</th>
                <th className="p-4">Contact & Location</th>
                <th className="p-4">Status</th>
                <th className="p-4">Days Left in Trial</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand text-charcoal">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-mutedGray">Loading gyms...</td>
                </tr>
              ) : gyms.length > 0 ? (
                gyms.map((g) => (
                  <tr key={g.id} className="hover:bg-cream-50 transition-colors">
                    <td className="p-4 font-bold text-espresso-800">
                      <div>
                        <p className="text-sm">{g.name}</p>
                        <span className="font-mono text-[10px] text-brass-600 font-semibold">{g.code_prefix}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold">{g.phone}</p>
                      <span className="text-[10px] text-mutedGray">{g.city}, {g.state}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        g.status === 'ACTIVE' ? 'bg-statusGreen-bg text-statusGreen-text' :
                        g.status === 'TRIAL' ? 'bg-statusAmber-bg text-statusAmber-text' : 'bg-statusRed-bg text-statusRed-text'
                      }`}>
                        {g.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-espresso-800">
                      {g.days_left_in_trial} days
                    </td>
                    <td className="p-4">
                      <select
                        value={g.status}
                        onChange={(e) => handleStatusChange(g.id, e.target.value)}
                        className="px-3 py-1 rounded-lg border border-sand bg-cream-50 text-xs font-semibold focus:outline-none"
                      >
                        <option value="TRIAL">30-Day Free Trial</option>
                        <option value="ACTIVE">Active Subscription</option>
                        <option value="SUSPENDED">Suspended</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-mutedGray">No gyms registered on platform yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

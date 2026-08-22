import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Building2, Save, CheckCircle2 } from 'lucide-react';

export const Settings = () => {
  const [gym, setGym] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchGym();
  }, []);

  const fetchGym = async () => {
    try {
      const res = await api.get('/gyms/profile/');
      setGym(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.patch('/gyms/profile/', gym);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Failed to save gym settings');
    }
  };

  if (!gym) return <div className="p-8 text-center text-xs text-mutedGray">Loading gym settings...</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-espresso-800">Gym Settings</h1>
        <p className="text-xs text-mutedGray">Update gym contact details, address, and code prefix for member IDs</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-sand shadow-xs space-y-6">
        {saved && (
          <div className="p-4 rounded-xl bg-statusGreen-bg text-statusGreen-text text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brass-500" />
            <span>Gym settings saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Gym Name</label>
            <input
              type="text"
              value={gym.name || ''}
              onChange={(e) => setGym({ ...gym, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-sand bg-cream-50 text-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Phone</label>
              <input
                type="text"
                value={gym.phone || ''}
                onChange={(e) => setGym({ ...gym, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-sand bg-cream-50 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Code Prefix (e.g. HERCULES)</label>
              <input
                type="text"
                value={gym.code_prefix || ''}
                onChange={(e) => setGym({ ...gym, code_prefix: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-sand bg-cream-50 text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Address</label>
            <textarea
              rows="3"
              value={gym.address || ''}
              onChange={(e) => setGym({ ...gym, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-sand bg-cream-50 text-xs font-medium"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-espresso-800 text-cream-100 text-xs font-bold shadow-md hover:bg-espresso-900 flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-brass-400" />
            <span>Save Gym Changes</span>
          </button>
        </form>
      </div>
    </div>
  );
};

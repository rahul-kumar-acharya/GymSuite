import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CalendarCheck, QrCode, Search, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export const Attendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [memberCodeInput, setMemberCodeInput] = useState('');
  const [checkinMessage, setCheckinMessage] = useState(null);

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await api.get(`/attendance/?date=${today}`);
      setAttendances(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCheckin = async (e) => {
    e.preventDefault();
    if (!memberCodeInput.trim()) return;

    setCheckinMessage(null);
    try {
      const res = await api.post('/attendance/checkin-by-code/', {
        member_code: memberCodeInput.trim(),
        method: 'MANUAL'
      });
      setCheckinMessage({ type: 'success', text: res.data.message });
      setMemberCodeInput('');
      fetchTodayAttendance();
    } catch (err) {
      setCheckinMessage({ type: 'error', text: err.response?.data?.error || 'Check-in failed.' });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-espresso-800">Attendance Log</h1>
        <p className="text-xs text-mutedGray">Record member daily check-ins via Code or QR scanner</p>
      </div>

      {/* Quick Check-in Control Panel */}
      <div className="bg-white rounded-3xl p-6 border border-sand shadow-xs space-y-4">
        <h3 className="font-heading text-lg font-bold text-espresso-800 flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-brass-500" />
          <span>Reception Quick Check-in</span>
        </h3>

        <form onSubmit={handleQuickCheckin} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-grow w-full">
            <Search className="w-4 h-4 text-mutedGray absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={memberCodeInput}
              onChange={(e) => setMemberCodeInput(e.target.value)}
              placeholder="Enter Member Code (e.g. HERCULES-0001 or GM-0001)..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand bg-cream-50 text-xs font-medium focus:outline-none focus:border-brass-500"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-espresso-800 text-cream-100 text-xs font-bold shadow-md hover:bg-espresso-900 transition-all flex items-center justify-center gap-2"
          >
            <span>Log Check-in</span>
          </button>
        </form>

        {/* Checkin Result Message */}
        {checkinMessage && (
          <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            checkinMessage.type === 'success' ? 'bg-statusGreen-bg text-statusGreen-text' : 'bg-statusRed-bg text-statusRed-text'
          }`}>
            {checkinMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{checkinMessage.text}</span>
          </div>
        )}
      </div>

      {/* Today's Check-ins Table */}
      <div className="bg-white rounded-2xl border border-sand overflow-hidden shadow-xs space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-sand pb-4">
          <h3 className="font-heading text-lg font-bold text-espresso-800">Check-ins Recorded Today</h3>
          <span className="text-xs font-bold text-brass-600 bg-cream-100 px-3 py-1 rounded-full">
            {attendances.length} Check-ins
          </span>
        </div>

        <div className="divide-y divide-sand">
          {loading ? (
            <p className="text-xs text-mutedGray py-6 text-center">Loading today's attendance...</p>
          ) : attendances.length > 0 ? (
            attendances.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-espresso-800 text-brass-400 flex items-center justify-center font-bold text-xs">
                    {item.member_name ? item.member_name[0] : 'M'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-espresso-800">{item.member_name}</p>
                    <span className="font-mono text-[10px] text-brass-600 font-semibold">{item.member_code} • {item.method}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    item.membership_status === 'ACTIVE' ? 'bg-statusGreen-bg text-statusGreen-text' : 'bg-statusRed-bg text-statusRed-text'
                  }`}>
                    {item.membership_status} Membership
                  </span>
                  <span className="text-xs font-mono font-bold text-espresso-800 bg-cream-100 px-3 py-1 rounded-lg">
                    {item.check_in}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-mutedGray py-8 text-center">No attendance check-ins recorded for today yet.</p>
          )}
        </div>
      </div>

    </div>
  );
};

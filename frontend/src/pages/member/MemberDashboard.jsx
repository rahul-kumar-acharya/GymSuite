import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Dumbbell, Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

export const MemberDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [qrToken, setQrToken] = useState('');
  const [workoutPlan, setWorkoutPlan] = useState(null);

  useEffect(() => {
    fetchMemberInfo();
  }, []);

  const fetchMemberInfo = async () => {
    try {
      const [profileRes, qrRes, workoutRes] = await Promise.all([
        api.get('/members/me/'),
        api.get('/attendance/qr-token/'),
        api.get('/workouts/plans/'),
      ]);
      setProfile(profileRes.data);
      setQrToken(qrRes.data.token);
      setWorkoutPlan((workoutRes.data.results || workoutRes.data)[0] || null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      
      {/* Digital Member ID Card */}
      <div className="bg-espresso-800 text-cream-100 rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-6 border border-espresso-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brass-500 text-espresso-900 flex items-center justify-center font-bold">
              <Dumbbell className="w-4 h-4" />
            </div>
            <span className="font-heading text-lg font-bold">{user?.gym_name || 'Hercules Gym'}</span>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-statusGreen-bg text-statusGreen-text">
            ACTIVE PASS
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brass-500/20 border-2 border-brass-400 text-brass-400 flex items-center justify-center font-bold text-2xl">
            {user?.first_name ? user.first_name[0] : 'M'}
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold">{user?.first_name} {user?.last_name}</h2>
            <p className="font-mono text-xs text-brass-400 font-bold tracking-wider">{profile?.member_id_code || 'HERCULES-0001'}</p>
          </div>
        </div>

        {/* QR Code Digital Pass Placeholder */}
        <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-espresso-900">
          {qrToken ? <QRCodeCanvas value={qrToken} size={128} includeMargin /> : <div className="h-32 w-32 animate-pulse rounded bg-cream-100" />}
          <span className="text-[10px] font-mono font-bold tracking-widest text-mutedGray">SCAN AT RECEPTION FOR ATTENDANCE</span>
        </div>
      </div>

      {/* Active Membership Details */}
      <div className="bg-white rounded-2xl p-6 border border-sand shadow-xs space-y-3">
        <h3 className="font-heading text-base font-bold text-espresso-800">Membership Details</h3>
        <div className="flex justify-between items-center text-xs border-b border-sand pb-2">
          <span className="text-mutedGray">Plan Name:</span>
          <span className="font-bold text-espresso-800">{profile?.active_membership?.plan_name || 'No active plan'}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-mutedGray">Days Remaining:</span>
          <span className="font-bold text-brass-600">{profile?.active_membership ? `${profile.active_membership.days_remaining} Days` : '0 Days'}</span>
        </div>
      </div>

      {/* Workout of the Day */}
      <div className="bg-white rounded-2xl p-6 border border-sand shadow-xs space-y-3">
        <h3 className="font-heading text-base font-bold text-espresso-800">Today's Workout Plan</h3>
        {workoutPlan ? <div className="space-y-3">{workoutPlan.days?.map((day) => <div key={day.id} className="rounded-xl border border-sand bg-cream-100 p-3 text-xs"><p className="font-bold text-espresso-800">{day.day_name}</p><div className="mt-2 space-y-1 text-mutedGray">{day.exercises?.map((exercise) => <p key={exercise.id}>{exercise.exercise_name} ({exercise.sets} x {exercise.reps})</p>)}</div></div>)}</div> : <p className="rounded-xl border border-dashed border-sand p-4 text-center text-xs text-mutedGray">No workout plan assigned yet.</p>}
      </div>

    </div>
  );
};

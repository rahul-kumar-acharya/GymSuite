import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Dumbbell } from 'lucide-react';
import { PortalPageShell, PortalState, PortalSurface } from '../../components/PortalPageShell';

export const MemberWorkouts = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { api.get('/workouts/plans/').then((response) => setPlans(response.data.results || response.data)).catch(() => setError('Workout plans could not be loaded.')).finally(() => setLoading(false)); }, []);
  return <PortalPageShell eyebrow="Member workspace" title="My workouts" subtitle="Training plans assigned by your trainer, organized by session."><PortalSurface><div className="mb-5 flex items-center justify-between border-b border-sand pb-4"><div><h2 className="font-heading text-lg font-bold text-espresso-800">Assigned routines</h2><p className="mt-1 text-xs text-mutedGray">Follow each session at your own pace.</p></div><span className="rounded-xl bg-cream-100 p-3 text-brass-600"><Dumbbell className="h-5 w-5" /></span></div>{loading ? <PortalState>Loading workout plans...</PortalState> : error ? <PortalState tone="error">{error}</PortalState> : plans.length ? <div className="space-y-4">{plans.map((plan) => <article key={plan.id} className="rounded-xl border border-sand bg-cream-50 p-4 sm:p-5"><h3 className="font-heading text-lg font-bold text-espresso-800">{plan.title}</h3><p className="mt-1 text-xs text-mutedGray">{plan.description || 'Your assigned training routine.'}</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{plan.days?.map((day) => <div key={day.id} className="rounded-xl border border-sand bg-white p-3"><h4 className="text-xs font-bold text-espresso-800">{day.day_name}</h4>{day.exercises?.map((exercise) => <p key={exercise.id} className="mt-2 text-[11px] text-mutedGray">{exercise.exercise_name} <span className="font-semibold text-espresso-800">{exercise.sets} x {exercise.reps}</span></p>)}</div>)}</div></article>)}</div> : <PortalState>No workout plan assigned yet.</PortalState>}</PortalSurface></PortalPageShell>;
};

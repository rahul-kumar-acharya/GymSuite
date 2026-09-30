import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export const TrainerWorkouts = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/workouts/plans/').then((response) => setPlans(response.data.results || response.data)).finally(() => setLoading(false)); }, []);
  return <section className="space-y-6"><header><h1 className="font-heading text-2xl font-bold text-espresso-800">Workout Plans</h1><p className="text-xs text-mutedGray">Plans you have created for your assigned clients.</p></header><div className="space-y-4">{loading ? <p className="text-xs text-mutedGray">Loading plans...</p> : plans.length ? plans.map((plan) => <article key={plan.id} className="rounded-2xl border border-sand bg-white p-5 shadow-xs"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-heading text-lg font-bold text-espresso-800">{plan.title}</h2><span className="rounded-full bg-cream-100 px-3 py-1 text-[10px] font-bold text-brass-600">{plan.assigned_members?.length || 0} clients</span></div><p className="mt-1 text-xs text-mutedGray">{plan.description || 'No description provided.'}</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{plan.days?.map((day) => <div key={day.id} className="rounded-xl border border-sand bg-cream-50 p-3"><h3 className="text-xs font-bold text-espresso-800">{day.day_name}</h3>{day.exercises?.map((exercise) => <p key={exercise.id} className="mt-1 text-[11px] text-mutedGray">{exercise.exercise_name} · {exercise.sets} x {exercise.reps}</p>)}</div>)}</div></article>) : <p className="text-xs text-mutedGray">No workout plans created yet.</p>}</div></section>;
};

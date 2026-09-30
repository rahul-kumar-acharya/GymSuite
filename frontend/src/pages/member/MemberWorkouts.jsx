import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export const MemberWorkouts = () => {
  const [plans, setPlans] = useState([]);
  useEffect(() => { api.get('/workouts/plans/').then((response) => setPlans(response.data.results || response.data)); }, []);
  return <section className="mx-auto max-w-3xl space-y-6"><header><h1 className="font-heading text-2xl font-bold text-espresso-800">My Workouts</h1><p className="text-xs text-mutedGray">Training plans assigned by your trainer.</p></header><div className="space-y-4">{plans.length ? plans.map((plan) => <article key={plan.id} className="rounded-2xl border border-sand bg-white p-5 shadow-xs"><h2 className="font-heading text-lg font-bold text-espresso-800">{plan.title}</h2><p className="mt-1 text-xs text-mutedGray">{plan.description}</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{plan.days?.map((day) => <div key={day.id} className="rounded-xl bg-cream-50 p-3"><h3 className="text-xs font-bold text-espresso-800">{day.day_name}</h3>{day.exercises?.map((exercise) => <p key={exercise.id} className="mt-1 text-[11px] text-mutedGray">{exercise.exercise_name} · {exercise.sets} x {exercise.reps}</p>)}</div>)}</div></article>) : <p className="text-xs text-mutedGray">No workout plan assigned yet.</p>}</div></section>;
};

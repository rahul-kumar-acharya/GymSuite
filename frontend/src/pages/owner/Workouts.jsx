import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Dumbbell, Plus, Layers, X } from 'lucide-react';

export const Workouts = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', days: [{ day_name: 'Day 1', order: 1, exercises: [{ exercise_name: '', sets: 3, reps: '10-12', rest_seconds: 60, notes: '' }] }] });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const res = await api.get('/workouts/plans/');
      setPlans(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateDay = (dayIndex, field, value) => setForm({ ...form, days: form.days.map((day, index) => index === dayIndex ? { ...day, [field]: value } : day) });
  const updateExercise = (dayIndex, exerciseIndex, field, value) => setForm({ ...form, days: form.days.map((day, index) => index === dayIndex ? { ...day, exercises: day.exercises.map((exercise, itemIndex) => itemIndex === exerciseIndex ? { ...exercise, [field]: value } : exercise) } : day) });
  const addDay = () => setForm({ ...form, days: [...form.days, { day_name: `Day ${form.days.length + 1}`, order: form.days.length + 1, exercises: [{ exercise_name: '', sets: 3, reps: '10-12', rest_seconds: 60, notes: '' }] }] });
  const addExercise = (dayIndex) => setForm({ ...form, days: form.days.map((day, index) => index === dayIndex ? { ...day, exercises: [...day.exercises, { exercise_name: '', sets: 3, reps: '10-12', rest_seconds: 60, notes: '' }] } : day) });
  const createPlan = async (event) => { event.preventDefault(); try { await api.post('/workouts/plans/', form); setShowForm(false); fetchWorkouts(); } catch (err) { setError(err.response?.data?.detail || 'Workout plan could not be created.'); } };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-espresso-800">Workout Routines</h1>
        <p className="text-xs text-mutedGray">Design exercise splits and assign workout routines to gym members</p>
      </div>
      <div className="flex justify-end"><button type="button" onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-xl bg-espresso-800 px-4 py-2.5 text-xs font-bold text-cream-100"><Plus className="h-4 w-4 text-brass-400" /> Create workout plan</button></div>
      {error && <p className="rounded-xl bg-statusRed-bg p-3 text-xs font-semibold text-statusRed-text">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <p className="text-xs text-mutedGray col-span-2 text-center py-12">Loading workout routines...</p>
        ) : plans.length > 0 ? (
          plans.map((w) => (
            <div key={w.id} className="bg-white rounded-2xl p-6 border border-sand shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-xl font-bold text-espresso-800">{w.title}</h3>
                <span className="text-xs font-bold text-brass-600 bg-cream-100 px-3 py-1 rounded-full">
                  {w.days?.length || 0} Training Days
                </span>
              </div>
              <p className="text-xs text-mutedGray">{w.description || 'Custom hypertrophy routine.'}</p>

              <div className="space-y-3 pt-2">
                {w.days && w.days.map((day) => (
                  <div key={day.id} className="p-3 rounded-xl bg-cream-100 border border-sand space-y-2">
                    <p className="text-xs font-bold text-espresso-800">{day.day_name}</p>
                    <div className="flex flex-wrap gap-2">
                      {day.exercises && day.exercises.map((ex) => (
                        <span key={ex.id} className="text-[10px] font-medium bg-white px-2.5 py-1 rounded-md border border-sand">
                          {ex.exercise_name} ({ex.sets} × {ex.reps})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-mutedGray col-span-2 text-center py-12">No workout routines created yet.</p>
        )}
      </div>
      {showForm && <div className="fixed inset-0 z-50 overflow-y-auto bg-espresso-900/60 p-4"><form onSubmit={createPlan} className="mx-auto my-8 max-w-2xl space-y-4 rounded-2xl bg-white p-6 shadow-xl"><div className="flex items-center justify-between"><h2 className="font-heading text-xl font-bold text-espresso-800">Create workout plan</h2><button type="button" aria-label="Close" onClick={() => setShowForm(false)}><X className="h-5 w-5" /></button></div><input required placeholder="Plan title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-xl border border-sand px-3 py-2 text-sm" /><textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border border-sand px-3 py-2 text-sm" />{form.days.map((day, dayIndex) => <div key={dayIndex} className="space-y-3 rounded-xl border border-sand bg-cream-50 p-4"><div className="flex items-center gap-2"><input value={day.day_name} onChange={(e) => updateDay(dayIndex, 'day_name', e.target.value)} className="flex-1 rounded-lg border border-sand px-3 py-2 text-sm" /><span className="text-[10px] font-bold uppercase text-mutedGray">Day {dayIndex + 1}</span></div>{day.exercises.map((exercise, exerciseIndex) => <div key={exerciseIndex} className="grid gap-2 sm:grid-cols-[1fr_80px_100px]"><input required placeholder="Exercise" value={exercise.exercise_name} onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'exercise_name', e.target.value)} className="rounded-lg border border-sand px-3 py-2 text-sm" /><input type="number" min="1" value={exercise.sets} onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'sets', Number(e.target.value))} className="rounded-lg border border-sand px-3 py-2 text-sm" /><input value={exercise.reps} onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'reps', e.target.value)} className="rounded-lg border border-sand px-3 py-2 text-sm" /></div>)}<button type="button" onClick={() => addExercise(dayIndex)} className="text-xs font-bold text-brass-600">+ Add exercise</button></div>)}<button type="button" onClick={addDay} className="text-xs font-bold text-brass-600">+ Add training day</button><button className="w-full rounded-xl bg-espresso-800 py-3 text-xs font-bold text-cream-100">Save workout plan</button></form></div>}
    </div>
  );
};

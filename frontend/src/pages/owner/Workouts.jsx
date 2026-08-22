import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Dumbbell, Plus, Layers } from 'lucide-react';

export const Workouts = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-espresso-800">Workout Routines</h1>
        <p className="text-xs text-mutedGray">Design exercise splits and assign workout routines to gym members</p>
      </div>

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
    </div>
  );
};

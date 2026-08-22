import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center p-4 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-espresso-800 text-brass-400 flex items-center justify-center font-bold">
        <Dumbbell className="w-8 h-8" />
      </div>
      <h1 className="font-heading text-4xl sm:text-5xl font-bold text-espresso-800">404 — Page Not Found</h1>
      <p className="text-mutedGray text-sm max-w-md">
        The page or resource you are looking for does not exist on GymSuite.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-espresso-800 text-cream-100 text-sm font-bold shadow-md hover:bg-espresso-900 transition-all"
      >
        <Home className="w-4 h-4 text-brass-400" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
};

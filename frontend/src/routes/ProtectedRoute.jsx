import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brass-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If trainer tries owner page, redirect to trainer dashboard, etc.
    if (user.role === 'TRAINER') return <Navigate to="/trainer/dashboard" replace />;
    if (user.role === 'MEMBER') return <Navigate to="/member/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

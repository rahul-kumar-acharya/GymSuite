import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { TrainerLayout } from '../layouts/TrainerLayout';
import { MemberLayout } from '../layouts/MemberLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Public Pages
import { Home } from '../pages/public/Home';
import { Features } from '../pages/public/Features';
import { Pricing } from '../pages/public/Pricing';
import { About } from '../pages/public/About';
import { Contact } from '../pages/public/Contact';
import { FAQ } from '../pages/public/FAQ';
import { PrivacyPolicy, Terms, RefundPolicy } from '../pages/public/LegalPages';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { PasswordReset } from '../pages/auth/PasswordReset';

// Super Admin Pages
import { AdminLogin } from '../pages/admin/AdminLogin';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminGyms } from '../pages/admin/AdminGyms';
import { AdminSubscriptions } from '../pages/admin/AdminSubscriptions';
import { AdminUsers } from '../pages/admin/AdminUsers';
import { AdminLogs } from '../pages/admin/AdminLogs';

// Owner / Staff Pages
import { Dashboard } from '../pages/owner/Dashboard';
import { Members } from '../pages/owner/Members';
import { MembershipPlans } from '../pages/owner/MembershipPlans';
import { Attendance } from '../pages/owner/Attendance';
import { Payments } from '../pages/owner/Payments';
import { Trainers } from '../pages/owner/Trainers';
import { Workouts } from '../pages/owner/Workouts';
import { Expenses } from '../pages/owner/Expenses';
import { Reports } from '../pages/owner/Reports';
import { Staff } from '../pages/owner/Staff';
import { Settings } from '../pages/owner/Settings';
import { SaaSSubscription } from '../pages/owner/SaaSSubscription';
import { Notifications } from '../pages/owner/Notifications';

// Trainer Pages
import { TrainerDashboard } from '../pages/trainer/TrainerDashboard';

// Member Pages
import { MemberDashboard } from '../pages/member/MemberDashboard';

// Error Page
import { NotFound } from '../pages/errors/NotFound';

// Protected Route Guard
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      
      {/* Public Marketing Site Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
      </Route>

      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<PasswordReset />} />
      <Route path="/reset-password/:uid/:token" element={<PasswordReset />} />

      {/* Super Admin Auth & Control Panel Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        element={
          <ProtectedRoute allowedRoles={['SUPERADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/gyms" element={<AdminGyms />} />
        <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/logs" element={<AdminLogs />} />
      </Route>

      {/* Gym Owner & Staff Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['SUPERADMIN', 'OWNER', 'MANAGER', 'STAFF']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/members" element={<Members />} />
        <Route path="/membership-plans" element={<MembershipPlans />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/trainers" element={<Trainers />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/subscription" element={<SaaSSubscription />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>

      {/* Trainer Portal Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['TRAINER', 'OWNER']}>
            <TrainerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
        <Route path="/trainer/members" element={<TrainerDashboard />} />
        <Route path="/trainer/workouts" element={<TrainerDashboard />} />
        <Route path="/trainer/profile" element={<TrainerDashboard />} />
      </Route>

      {/* Member Portal Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['MEMBER', 'OWNER']}>
            <MemberLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/member/dashboard" element={<MemberDashboard />} />
        <Route path="/member/membership" element={<MemberDashboard />} />
        <Route path="/member/attendance" element={<MemberDashboard />} />
        <Route path="/member/workout" element={<MemberDashboard />} />
        <Route path="/member/profile" element={<MemberDashboard />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

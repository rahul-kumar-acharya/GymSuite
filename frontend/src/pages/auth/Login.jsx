import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Dumbbell, UserCheck, Dumbbell as TrainerIcon, Users, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [accountType, setAccountType] = useState('OWNER_STAFF'); // 'OWNER_STAFF', 'TRAINER', 'MEMBER'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(username, password);
      
      // Role-based redirection logic strictly decided by backend response
      const role = userData.role;
      if (role === 'SUPERADMIN') {
        navigate('/admin/dashboard');
      } else if (role === 'OWNER' || role === 'MANAGER' || role === 'STAFF') {
        navigate('/dashboard');
      } else if (role === 'TRAINER') {
        navigate('/trainer/dashboard');
      } else if (role === 'MEMBER') {
        navigate('/member/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Invalid email/phone or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = () => {
    if (accountType === 'OWNER_STAFF') return 'Owner / Staff';
    if (accountType === 'TRAINER') return 'Trainer';
    return 'Gym Member';
  };

  const getPlaceholder = () => {
    if (accountType === 'OWNER_STAFF') return 'owner@herculesgym.com';
    if (accountType === 'TRAINER') return 'trainer@herculesgym.com';
    return 'amit@gmail.com';
  };

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-sand shadow-lg space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-espresso-800 text-brass-500 flex items-center justify-center shadow-md">
              <Dumbbell className="w-6 h-6" />
            </div>
            <span className="font-heading text-2xl font-bold text-espresso-800">GymSuite</span>
          </Link>
          <h2 className="font-heading text-2xl font-bold text-espresso-800 pt-2">Welcome back</h2>
          <p className="text-xs text-mutedGray">Sign in to your GymSuite operating account</p>
        </div>

        {/* Role Toggle Tabs: [ Owner / Staff ] [ Trainer ] [ Member ] */}
        <div className="bg-cream-100 p-1.5 rounded-2xl flex items-center border border-sand gap-1">
          <button
            type="button"
            onClick={() => setAccountType('OWNER_STAFF')}
            className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
              accountType === 'OWNER_STAFF'
                ? 'bg-espresso-800 text-cream-100 shadow-xs'
                : 'text-mutedGray hover:text-espresso-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Owner / Staff</span>
          </button>

          <button
            type="button"
            onClick={() => setAccountType('TRAINER')}
            className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
              accountType === 'TRAINER'
                ? 'bg-espresso-800 text-cream-100 shadow-xs'
                : 'text-mutedGray hover:text-espresso-800'
            }`}
          >
            <TrainerIcon className="w-3.5 h-3.5 text-brass-400" />
            <span>Trainer</span>
          </button>

          <button
            type="button"
            onClick={() => setAccountType('MEMBER')}
            className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
              accountType === 'MEMBER'
                ? 'bg-espresso-800 text-cream-100 shadow-xs'
                : 'text-mutedGray hover:text-espresso-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Member</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-statusRed-bg border border-statusRed-text/30 text-statusRed-text text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">
              {getRoleLabel()} Email or Mobile
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-mutedGray absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-sand bg-cream-50 text-sm focus:outline-none focus:border-brass-500 font-medium"
                placeholder={getPlaceholder()}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase text-espresso-800">Password</label>
              <Link to="/forgot-password" className="text-xs text-brass-600 font-semibold hover:underline">Forgot?</Link>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-mutedGray absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-sand bg-cream-50 text-sm focus:outline-none focus:border-brass-500 font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-espresso-800 text-cream-100 text-sm font-bold shadow-md hover:bg-espresso-900 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : `Log in as ${getRoleLabel()}`}</span>
            <ArrowRight className="w-4 h-4 text-brass-400" />
          </button>
        </form>

        {/* Demo Credentials Quick-Fill Hint Box */}
        <div className="p-4 rounded-2xl bg-cream-100 border border-sand text-xs space-y-2">
          <p className="font-bold text-espresso-800 uppercase tracking-wider">Demo Quick Test Credentials:</p>
          <div className="flex items-center justify-between text-mutedGray">
            <span>Owner Account:</span>
            <button
              type="button"
              onClick={() => {
                setAccountType('OWNER_STAFF');
                setUsername('owner@herculesgym.com');
                setPassword('gymsuite123');
              }}
              className="text-brass-600 font-bold hover:underline"
            >
              Fill Owner Demo
            </button>
          </div>
          <div className="flex items-center justify-between text-mutedGray">
            <span>Trainer Account:</span>
            <button
              type="button"
              onClick={() => {
                setAccountType('TRAINER');
                setUsername('trainer@herculesgym.com');
                setPassword('gymsuite123');
              }}
              className="text-brass-600 font-bold hover:underline"
            >
              Fill Trainer Demo
            </button>
          </div>
          <div className="flex items-center justify-between text-mutedGray">
            <span>Member Account:</span>
            <button
              type="button"
              onClick={() => {
                setAccountType('MEMBER');
                setUsername('amit@gmail.com');
                setPassword('gymsuite123');
              }}
              className="text-brass-600 font-bold hover:underline"
            >
              Fill Member Demo
            </button>
          </div>
        </div>

        {/* Sign up prompt */}
        <div className="text-center text-xs text-mutedGray">
          New gym owner?{' '}
          <Link to="/register" className="font-bold text-espresso-800 hover:text-brass-600">
            Start 30-Day Free Trial
          </Link>
        </div>

      </div>
    </div>
  );
};

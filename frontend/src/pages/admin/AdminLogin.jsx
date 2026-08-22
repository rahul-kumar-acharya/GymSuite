import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Dumbbell } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(email, password);
      if (userData.role !== 'SUPERADMIN') {
        setError('Access denied. This portal requires AcharyaWorks Super Admin privileges.');
        return;
      }
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Invalid Super Admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-espresso-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-espresso-800 rounded-3xl p-8 border border-espresso-700 text-cream-100 shadow-2xl space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brass-500 text-espresso-900 flex items-center justify-center font-bold shadow-lg">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="text-left">
              <span className="font-heading text-2xl font-bold text-cream-100 block">GymSuite</span>
              <span className="text-[10px] uppercase font-bold text-brass-400 tracking-widest">AcharyaWorks Core</span>
            </div>
          </div>
          <h2 className="font-heading text-2xl font-bold pt-4 text-white">Super Admin Command Center</h2>
          <p className="text-xs text-cream-200/70">Master platform access & multi-tenant control</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-statusRed-bg border border-statusRed-text/30 text-statusRed-text text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-brass-400 mb-1">Super Admin Username / Email</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-cream-200/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-espresso-700 bg-espresso-900 text-cream-100 text-sm focus:outline-none focus:border-brass-400 font-medium"
                placeholder="admin@gymsuite.in"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-brass-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-cream-200/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-espresso-700 bg-espresso-900 text-cream-100 text-sm focus:outline-none focus:border-brass-400 font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brass-500 text-espresso-900 text-sm font-bold shadow-md hover:bg-brass-400 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Verifying Super Admin...' : 'Authenticate Super Admin'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Fill Box */}
        <div className="p-4 rounded-2xl bg-espresso-900/80 border border-espresso-700 text-xs space-y-2">
          <p className="font-bold text-brass-400 uppercase tracking-wider">Super Admin Credentials:</p>
          <div className="flex items-center justify-between text-cream-200/70">
            <span>Username: <strong className="text-white">admin@gymsuite.in</strong></span>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@gymsuite.in');
                setPassword('admin123');
              }}
              className="text-brass-400 font-bold hover:underline"
            >
              Fill Credentials
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-cream-200/50">
          <Link to="/" className="hover:text-brass-400 transition-colors">
            ← Return to Public Website
          </Link>
        </div>

      </div>
    </div>
  );
};

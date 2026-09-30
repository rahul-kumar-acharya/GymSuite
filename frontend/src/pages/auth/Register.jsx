import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Dumbbell, User, Building2, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const Register = () => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    gym_name: '',
    gym_phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.full_name || !formData.email || !formData.phone || !formData.password) {
        setError('Please fill in all owner account fields.');
        return;
      }
      setError('');
      setStep(2);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.email?.[0] || err.response?.data?.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 border border-sand shadow-lg space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-espresso-800 text-brass-500 flex items-center justify-center shadow-md">
              <Dumbbell className="w-6 h-6" />
            </div>
            <span className="font-heading text-2xl font-bold text-espresso-800">GymSuite</span>
          </Link>
          <h2 className="font-heading text-2xl font-bold text-espresso-800 pt-2">Start 30-Day Free Trial</h2>
          <p className="text-xs text-mutedGray">Register your gym owner account & auto-provision your gym</p>
        </div>

        {/* 3-Step Progress Indicator */}
        <div className="flex items-center justify-between border-b border-sand pb-4">
          <div className={`flex items-center gap-2 text-xs font-bold ${step >= 1 ? 'text-espresso-800' : 'text-mutedGray'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-espresso-800 text-cream-100' : 'bg-sand text-mutedGray'}`}>1</div>
            <span>Owner Account</span>
          </div>

          <div className="w-8 h-[2px] bg-sand" />

          <div className={`flex items-center gap-2 text-xs font-bold ${step >= 2 ? 'text-espresso-800' : 'text-mutedGray'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-espresso-800 text-cream-100' : 'bg-sand text-mutedGray'}`}>2</div>
            <span>Gym Info</span>
          </div>

          <div className="w-8 h-[2px] bg-sand" />

          <div className={`flex items-center gap-2 text-xs font-bold ${step >= 3 ? 'text-espresso-800' : 'text-mutedGray'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-espresso-800 text-cream-100' : 'bg-sand text-mutedGray'}`}>3</div>
            <span>Trial Activation</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-statusRed-bg border border-statusRed-text/30 text-statusRed-text text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: OWNER ACCOUNT */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Full Name</label>
              <input
                type="text"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-sand bg-cream-50 text-sm focus:outline-none focus:border-brass-500 font-medium"
                placeholder="e.g. Vikram Rathore"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-sand bg-cream-50 text-sm focus:outline-none focus:border-brass-500 font-medium"
                  placeholder="owner@mygym.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-sand bg-cream-50 text-sm focus:outline-none focus:border-brass-500 font-medium"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                minLength="6"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 pr-12 py-3 rounded-xl border border-sand bg-cream-50 text-sm focus:outline-none focus:border-brass-500 font-medium"
                placeholder="•••••••• (min 6 characters)"
              />
              <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-mutedGray hover:text-brass-600">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-espresso-800 text-cream-100 text-sm font-bold shadow-md hover:bg-espresso-900 transition-all flex items-center justify-center gap-2"
            >
              <span>Continue to Gym Details</span>
              <ArrowRight className="w-4 h-4 text-brass-400" />
            </button>
          </form>
        )}

        {/* STEP 2: GYM DETAILS */}
        {step === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Gym Name</label>
                <input
                  type="text"
                  name="gym_name"
                  required
                  value={formData.gym_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-sand bg-cream-50 text-sm focus:outline-none focus:border-brass-500 font-medium"
                  placeholder="e.g. Iron Fitness Club"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Gym Contact Phone</label>
                <input
                  type="text"
                  name="gym_phone"
                  required
                  value={formData.gym_phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-sand bg-cream-50 text-sm focus:outline-none focus:border-brass-500 font-medium"
                  placeholder="+91 98765 00000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Full Street Address</label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-sand bg-cream-50 text-sm focus:outline-none focus:border-brass-500 font-medium"
                placeholder="Plot 12, Main Road"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-espresso-800 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-sand bg-cream-50 text-xs font-medium"
                  placeholder="Bengaluru"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-espresso-800 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-sand bg-cream-50 text-xs font-medium"
                  placeholder="Karnataka"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-espresso-800 mb-1">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-sand bg-cream-50 text-xs font-medium"
                  placeholder="560001"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-xl border border-sand text-espresso-800 text-xs font-bold hover:bg-cream-100 flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="w-2/3 py-3.5 rounded-xl bg-espresso-800 text-cream-100 text-sm font-bold shadow-md hover:bg-espresso-900 transition-all flex items-center justify-center gap-2"
              >
                <span>Review & Activate</span>
                <ArrowRight className="w-4 h-4 text-brass-400" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: TRIAL ACTIVATION CONFIRMATION */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-cream-100 border border-sand space-y-4">
              <div className="flex items-center gap-3 text-statusGreen-text">
                <CheckCircle2 className="w-6 h-6 text-brass-500" />
                <span className="font-heading text-lg font-bold text-espresso-800">Summary & Trial Provisions</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-mutedGray block">Owner Name:</span>
                  <span className="font-bold text-espresso-800">{formData.full_name}</span>
                </div>
                <div>
                  <span className="text-mutedGray block">Owner Email:</span>
                  <span className="font-bold text-espresso-800">{formData.email}</span>
                </div>
                <div>
                  <span className="text-mutedGray block">Gym Name:</span>
                  <span className="font-bold text-espresso-800">{formData.gym_name}</span>
                </div>
                <div>
                  <span className="text-mutedGray block">Location:</span>
                  <span className="font-bold text-espresso-800">{formData.city}, {formData.state}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-brass-500/10 border border-brass-400/30 text-xs text-brass-700 font-semibold">
                Your 30-Day Free Trial will be created automatically. All features (Members, Attendance, Fee Collections, Trainers, Reports) will be enabled immediately.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-3 rounded-xl border border-sand text-espresso-800 text-xs font-bold hover:bg-cream-100 flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Edit Info</span>
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={loading}
                className="w-2/3 py-3.5 rounded-xl bg-brass-500 text-espresso-900 text-sm font-bold shadow-md hover:bg-brass-400 transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Creating Gym Account...' : 'Confirm & Launch Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="text-center text-xs text-mutedGray">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-espresso-800 hover:text-brass-600">
            Log in to your account
          </Link>
        </div>

      </div>
    </div>
  );
};

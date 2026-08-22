import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, ShieldCheck, Users, Calendar, CreditCard, 
  UserCheck, BarChart3, Dumbbell, Zap, CheckCircle2, Clock
} from 'lucide-react';

export const Home = () => {
  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brass-500/10 border border-brass-500/30 text-brass-600 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-4 h-4 text-brass-500" />
            <span>Built under AcharyaWorks Ecosystem</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-espresso-800 leading-[1.1]">
            Run Your Gym. <br className="hidden sm:inline" />
            <span className="text-brass-500 italic">Better.</span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-mutedGray font-normal leading-relaxed">
            Manage members, memberships, attendance, payments, trainers, and complete gym operations — all in one classy, seamless platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-espresso-800 text-cream-100 text-base font-bold shadow-lg hover:bg-espresso-900 transition-all hover:scale-105"
            >
              <span>Start Free 30-Day Trial</span>
              <ArrowRight className="w-5 h-5 text-brass-400" />
            </Link>
            <Link
              to="/features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-sand bg-white text-espresso-800 text-base font-semibold hover:bg-cream-50 transition-all"
            >
              <span>Explore Features</span>
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-mutedGray">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brass-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brass-500" />
              <span>30-Day Unlimited Free Trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brass-500" />
              <span>Instant Setup in 2 Minutes</span>
            </div>
          </div>

        </div>
      </section>

      {/* Trust & Core Value Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-sand shadow-sm space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-espresso-800">
              Everything your gym needs. Nothing you don't.
            </h2>
            <p className="text-mutedGray text-base">
              Replace messy paper registers, Excel sheets, and manual WhatsApp reminder texts with a single operating system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-cream-100/60 border border-sand space-y-3 hover:border-brass-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-espresso-800 text-brass-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-espresso-800">Member Management</h3>
              <p className="text-sm text-mutedGray leading-relaxed">
                Add, edit, search, and track member details, emergency contacts, and active status effortlessly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-cream-100/60 border border-sand space-y-3 hover:border-brass-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-espresso-800 text-brass-400 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-espresso-800">Attendance Engine</h3>
              <p className="text-sm text-mutedGray leading-relaxed">
                Quick manual check-in or instant QR scanner check-in with automated membership validity check.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-cream-100/60 border border-sand space-y-3 hover:border-brass-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-espresso-800 text-brass-400 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-espresso-800">Membership Plans</h3>
              <p className="text-sm text-mutedGray leading-relaxed">
                Flexible Monthly, Quarterly, Half-Yearly, Yearly, and Custom plans with auto-calculated expiry dates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-cream-100/60 border border-sand space-y-3 hover:border-brass-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-espresso-800 text-brass-400 flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-espresso-800">Fee Collections & Receipts</h3>
              <p className="text-sm text-mutedGray leading-relaxed">
                Collect Cash, UPI, or Card payments. Track partial dues, generate digital receipts, and view pending fees.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-cream-100/60 border border-sand space-y-3 hover:border-brass-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-espresso-800 text-brass-400 flex items-center justify-center">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-espresso-800">Trainers & Workouts</h3>
              <p className="text-sm text-mutedGray leading-relaxed">
                Assign members to trainers, design daily exercise splits, and track member progress logs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-cream-100/60 border border-sand space-y-3 hover:border-brass-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-espresso-800 text-brass-400 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-espresso-800">Business Analytics</h3>
              <p className="text-sm text-mutedGray leading-relaxed">
                Real-time dashboard metrics: revenue, operational expenses, net profit, and membership renewal rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-espresso-800 rounded-3xl p-10 sm:p-16 text-center text-cream-100 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brass-500/10 rounded-full blur-3xl" />
          <h2 className="font-heading text-3xl sm:text-5xl font-bold">
            Ready to upgrade your gym management?
          </h2>
          <p className="max-w-2xl mx-auto text-cream-200/80 text-base sm:text-lg">
            Join modern fitness centers running on GymSuite. Start your 30-day full feature free trial today.
          </p>
          <div className="pt-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-brass-500 text-espresso-900 text-base font-bold hover:bg-brass-400 transition-all hover:scale-105 shadow-md"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Users, CreditCard, CalendarCheck, Award, Dumbbell, Receipt, BarChart3, BellRing, ArrowRight } from 'lucide-react';

export const Features = () => {
  const featuresList = [
    {
      title: "Member Management",
      icon: Users,
      desc: "Maintain complete profile records for all your gym members including phone, emergency contacts, registration dates, active plan status, and profile notes."
    },
    {
      title: "Membership Plans & Expiry Tracking",
      icon: CreditCard,
      desc: "Configure flexible plans (Monthly, Quarterly, Half-Yearly, Yearly, Custom). Automatic end-date calculation ensures expiring members are flagged 7 days in advance."
    },
    {
      title: "Attendance & QR Scanner",
      icon: CalendarCheck,
      desc: "Quick one-click manual check-ins at reception or self-checkin via QR scanner. Instant validation checks if the member has an active membership plan."
    },
    {
      title: "Payment Collections & Digital Receipts",
      icon: Award,
      desc: "Collect payments via Cash, UPI, GPay, Card, or Netbanking. Track pending dues, partial payments, and auto-generate clean receipt numbers."
    },
    {
      title: "Trainers & Workout Routines",
      icon: Dumbbell,
      desc: "Assign members to certified trainers. Create daily exercise splits (Chest, Back, Legs) with sets, reps, and rest intervals."
    },
    {
      title: "Expense Management",
      icon: Receipt,
      desc: "Log all operational expenses including floor rent, electricity bills, equipment maintenance, and staff salaries for true profit accounting."
    },
    {
      title: "Business Analytics & Financial Reports",
      icon: BarChart3,
      desc: "Understand your gym's financial health with real-time aggregates: Monthly Revenue, Expense Breakdown, Net Profit, and Renewal Growth Rates."
    },
    {
      title: "In-App Alerts & Notifications",
      icon: BellRing,
      desc: "Never miss a payment or membership renewal. Automatic system notifications alert staff when memberships are expiring or payments are past due."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-espresso-800">
          Features Built for Modern Gym Owners
        </h1>
        <p className="text-mutedGray text-lg">
          Designed from the ground up to reduce repetitive manual work, streamline collections, and keep members engaged.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {featuresList.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-8 border border-sand shadow-xs space-y-4 hover:border-brass-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-espresso-800 text-brass-400 flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-espresso-800">{f.title}</h3>
              <p className="text-mutedGray text-sm leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-cream-200/50 rounded-2xl p-8 text-center border border-sand space-y-4">
        <h3 className="font-heading text-2xl font-bold text-espresso-800">Want to test these features on your gym data?</h3>
        <p className="text-mutedGray text-sm max-w-xl mx-auto">
          Start a risk-free 30-day free trial. No credit card required. Setup takes under 2 minutes.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-espresso-800 text-cream-100 font-semibold hover:bg-espresso-900 transition-all"
        >
          <span>Start 30-Day Free Trial</span>
          <ArrowRight className="w-4 h-4 text-brass-400" />
        </Link>
      </div>

    </div>
  );
};

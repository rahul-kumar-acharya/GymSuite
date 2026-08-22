import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Zap, Shield, ArrowRight } from 'lucide-react';

export const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "₹499",
      period: "/month",
      desc: "Perfect for small independent gyms and personal training studios.",
      features: [
        "Up to 100 Active Members",
        "Member CRUD Management",
        "Custom Membership Plans",
        "Manual & QR Attendance",
        "Payment Dues Tracking",
        "Email & In-App Notifications"
      ],
      cta: "Start 30-Day Free Trial",
      popular: false
    },
    {
      name: "Professional",
      price: "₹999",
      period: "/month",
      desc: "For growing fitness centers requiring complete operational control.",
      features: [
        "Up to 500 Active Members",
        "Everything in Starter Plan",
        "Trainer & Client Roster",
        "Workout & Routine Builder",
        "Expense Tracking & Profit Reports",
        "Digital PDF Payment Receipts",
        "Staff Account Access"
      ],
      cta: "Start 30-Day Free Trial",
      popular: true
    },
    {
      name: "Premium",
      price: "₹1,499",
      period: "/month",
      desc: "For high-volume gyms and multi-trainer fitness facilities.",
      features: [
        "Unlimited Active Members",
        "Everything in Professional Plan",
        "Advanced Revenue Analytics",
        "Unlimited Staff & Trainers",
        "Priority 24/7 Phone Support",
        "White-label Branding Options"
      ],
      cta: "Start 30-Day Free Trial",
      popular: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brass-500/10 border border-brass-500/30 text-brass-600 text-xs font-semibold uppercase">
          <Zap className="w-4 h-4 text-brass-500" />
          <span>30-Day Full Feature Free Trial Included</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-espresso-800">
          Simple, Transparent Pricing
        </h1>
        <p className="text-mutedGray text-lg">
          No hidden fees. No long-term lock-in. Upgrade or downgrade anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((p, idx) => (
          <div
            key={idx}
            className={`rounded-3xl p-8 bg-white border flex flex-col justify-between space-y-8 relative ${
              p.popular ? 'border-2 border-brass-500 shadow-lg scale-105 z-10' : 'border-sand shadow-xs'
            }`}
          >
            {p.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brass-500 text-espresso-900 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
                Most Popular
              </span>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-2xl font-bold text-espresso-800">{p.name}</h3>
                <p className="text-xs text-mutedGray mt-1">{p.desc}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="font-heading text-4xl font-bold text-espresso-800">{p.price}</span>
                <span className="text-sm font-medium text-mutedGray">{p.period}</span>
              </div>

              <div className="space-y-3 border-t border-sand pt-6">
                <p className="text-xs font-bold uppercase text-brass-600 tracking-wider">What's Included</p>
                {p.features.map((feat, fidx) => (
                  <div key={fidx} className="flex items-center gap-3 text-sm text-charcoal">
                    <Check className="w-4 h-4 text-brass-500 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/register"
              className={`w-full text-center py-3.5 rounded-xl text-sm font-bold transition-all ${
                p.popular
                  ? 'bg-brass-500 text-espresso-900 hover:bg-brass-400 shadow-md'
                  : 'bg-espresso-800 text-cream-100 hover:bg-espresso-900'
              }`}
            >
              {p.cta}
            </Link>

          </div>
        ))}
      </div>

    </div>
  );
};

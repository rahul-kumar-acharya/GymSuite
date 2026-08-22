import React from 'react';

export const FAQ = () => {
  const faqs = [
    {
      q: "How does the 30-day free trial work?",
      a: "When you register your gym owner account, GymSuite automatically provisions a full-featured 30-day trial with all core modules active. No credit card or upfront payment is required."
    },
    {
      q: "Can other gym owners see my member data?",
      a: "No. GymSuite uses strict multi-tenant scoping at the backend database query level. Every API request filters data strictly by your gym ID."
    },
    {
      q: "Can I add multiple staff accounts and trainers?",
      a: "Yes. You can add Receptionists, Managers, and Certified Trainers with customized role-based access permissions."
    },
    {
      q: "How does QR attendance work?",
      a: "Each registered member gets a unique digital QR code in their Member Portal. Your front desk staff can scan the QR code to log instantaneous check-ins and verify plan validity."
    },
    {
      q: "What happens when my 30-day trial ends?",
      a: "Your dashboard shifts into read-only mode while keeping all your members and records intact. You can choose a monthly plan (Starter, Professional, or Premium) to restore full write access."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="font-heading text-4xl font-bold text-espresso-800">Frequently Asked Questions</h1>
        <p className="text-mutedGray text-base">Everything you need to know about GymSuite multi-tenant platform.</p>
      </div>

      <div className="space-y-6">
        {faqs.map((f, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-sand shadow-xs space-y-2">
            <h3 className="font-heading text-xl font-bold text-espresso-800">{f.q}</h3>
            <p className="text-mutedGray text-sm leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

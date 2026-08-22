import React from 'react';

export const PrivacyPolicy = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
    <h1 className="font-heading text-4xl font-bold text-espresso-800">Privacy Policy</h1>
    <p className="text-sm text-mutedGray">Last Updated: August 2026</p>
    <div className="bg-white rounded-3xl p-8 border border-sand space-y-4 text-charcoal text-sm leading-relaxed">
      <p>GymSuite ("AcharyaWorks") is committed to protecting the privacy of gym owners, staff, and gym members.</p>
      <h3 className="font-heading text-xl font-bold text-espresso-800">Data Scoping & Ownership</h3>
      <p>All data entered under a gym account remains the exclusive property of the respective gym tenant. GymSuite never sells or shares tenant data with third parties.</p>
      <h3 className="font-heading text-xl font-bold text-espresso-800">Security & Encryption</h3>
      <p>Passwords are securely hashed and authenticated via JWT standard tokens. Database connections enforce strict access controls.</p>
    </div>
  </div>
);

export const Terms = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
    <h1 className="font-heading text-4xl font-bold text-espresso-800">Terms of Service</h1>
    <p className="text-sm text-mutedGray">Last Updated: August 2026</p>
    <div className="bg-white rounded-3xl p-8 border border-sand space-y-4 text-charcoal text-sm leading-relaxed">
      <p>By accessing or using GymSuite (`gymsuite.acharyaworks.in`), you agree to abide by these terms under AcharyaWorks ecosystem.</p>
      <h3 className="font-heading text-xl font-bold text-espresso-800">Account Responsibility</h3>
      <p>Gym owners are responsible for maintaining the confidentiality of staff and administrator credentials.</p>
    </div>
  </div>
);

export const RefundPolicy = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
    <h1 className="font-heading text-4xl font-bold text-espresso-800">Refund & Cancellation Policy</h1>
    <p className="text-sm text-mutedGray">Last Updated: August 2026</p>
    <div className="bg-white rounded-3xl p-8 border border-sand space-y-4 text-charcoal text-sm leading-relaxed">
      <p>GymSuite offers a 30-day full-featured free trial so you can evaluate the platform before making any financial commitment.</p>
      <h3 className="font-heading text-xl font-bold text-espresso-800">Subscription Cancellations</h3>
      <p>You can cancel your SaaS subscription anytime from your Gym Settings page. No auto-renewal charges will occur post-cancellation.</p>
    </div>
  </div>
);

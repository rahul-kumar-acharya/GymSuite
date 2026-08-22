import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="font-heading text-4xl font-bold text-espresso-800">Contact GymSuite Support</h1>
        <p className="text-mutedGray text-base">Have questions about setting up your gym? Our team is here to help.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white rounded-3xl p-8 border border-sand shadow-xs space-y-6">
          <h3 className="font-heading text-2xl font-bold text-espresso-800">Send Us a Message</h3>
          {submitted ? (
            <div className="p-6 rounded-2xl bg-statusGreen-bg text-statusGreen-text text-sm font-semibold">
              Thank you! Your inquiry has been received. Our team will contact you shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Your Name</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-sand bg-cream-100 text-sm focus:outline-none focus:border-brass-500" placeholder="e.g. Vikram Rathore" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Email Address</label>
                <input required type="email" className="w-full px-4 py-3 rounded-xl border border-sand bg-cream-100 text-sm focus:outline-none focus:border-brass-500" placeholder="owner@gym.com" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Message</label>
                <textarea required rows="4" className="w-full px-4 py-3 rounded-xl border border-sand bg-cream-100 text-sm focus:outline-none focus:border-brass-500" placeholder="Tell us about your gym..."></textarea>
              </div>
              <button type="submit" className="w-full py-3.5 rounded-xl bg-espresso-800 text-cream-100 font-bold text-sm hover:bg-espresso-900 transition-colors flex items-center justify-center gap-2">
                <Send className="w-4 h-4 text-brass-400" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

        <div className="space-y-6 flex flex-col justify-center">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brass-500/20 border border-brass-400/40 text-brass-600 flex items-center justify-center font-bold">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading text-lg font-bold text-espresso-800">Email Support</h4>
              <p className="text-sm text-mutedGray">support@acharyaworks.in</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brass-500/20 border border-brass-400/40 text-brass-600 flex items-center justify-center font-bold">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading text-lg font-bold text-espresso-800">Sales Hotline</h4>
              <p className="text-sm text-mutedGray">+91 98765 43210</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brass-500/20 border border-brass-400/40 text-brass-600 flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading text-lg font-bold text-espresso-800">Domain & Operating Unit</h4>
              <p className="text-sm text-mutedGray">gymsuite.acharyaworks.in</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

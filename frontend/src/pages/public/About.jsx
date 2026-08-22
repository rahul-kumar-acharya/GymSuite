import React from 'react';
import { Dumbbell, Shield, Award, Users } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-brass-500">AcharyaWorks Product Ecosystem</span>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-espresso-800">
          About GymSuite
        </h1>
        <p className="text-mutedGray text-lg max-w-2xl mx-auto">
          We are on a mission to empower local gym owners and fitness franchises with enterprise-grade operating tools.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-sand space-y-8 shadow-xs">
        <h2 className="font-heading text-3xl font-bold text-espresso-800">Our Vision</h2>
        <p className="text-charcoal leading-relaxed text-base">
          Gym owners spend countless hours each week manually tracking member expirations, checking physical attendance ledgers, sending WhatsApp payment reminder texts, and balancing cash registers. GymSuite brings everything into one unified, elegant system designed specifically for independent fitness centers across India.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-sand">
          <div className="space-y-2">
            <h4 className="font-heading text-2xl font-bold text-brass-500">100% Multi-Tenant</h4>
            <p className="text-xs text-mutedGray">Isolated data architecture guaranteeing complete privacy between fitness centers.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-heading text-2xl font-bold text-brass-500">Zero Technical Friction</h4>
            <p className="text-xs text-mutedGray">Intuitive workflows so gym receptionists and trainers can operate without complex training.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-heading text-2xl font-bold text-brass-500">AcharyaWorks Quality</h4>
            <p className="text-xs text-mutedGray">Built under the AcharyaWorks engineering standard for security, speed, and reliability.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

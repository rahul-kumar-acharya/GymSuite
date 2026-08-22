import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Dumbbell, Menu, X, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

export const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 text-charcoal">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-cream-100/90 backdrop-blur-md border-b border-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-espresso-800 flex items-center justify-center text-brass-500 shadow-md group-hover:bg-espresso-900 transition-colors">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-bold tracking-tight text-espresso-800">
                  GymSuite
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-brass-500 -mt-1">
                  AcharyaWorks
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-warm-500">
              <Link to="/features" className={`transition-colors hover:text-espresso-800 ${isActive('/features') ? 'text-espresso-800 font-semibold border-b-2 border-brass-500 pb-1' : ''}`}>
                Features
              </Link>
              <Link to="/pricing" className={`transition-colors hover:text-espresso-800 ${isActive('/pricing') ? 'text-espresso-800 font-semibold border-b-2 border-brass-500 pb-1' : ''}`}>
                Pricing
              </Link>
              <Link to="/about" className={`transition-colors hover:text-espresso-800 ${isActive('/about') ? 'text-espresso-800 font-semibold border-b-2 border-brass-500 pb-1' : ''}`}>
                About
              </Link>
              <Link to="/contact" className={`transition-colors hover:text-espresso-800 ${isActive('/contact') ? 'text-espresso-800 font-semibold border-b-2 border-brass-500 pb-1' : ''}`}>
                Contact
              </Link>
              <Link to="/faq" className={`transition-colors hover:text-espresso-800 ${isActive('/faq') ? 'text-espresso-800 font-semibold border-b-2 border-brass-500 pb-1' : ''}`}>
                FAQ
              </Link>
            </nav>

            {/* Desktop Auth CTA */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="px-5 py-2.5 text-sm font-semibold text-espresso-800 hover:text-brass-600 transition-colors">
                Log in
              </Link>
              <Link to="/register" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-espresso-800 text-cream-100 text-sm font-semibold hover:bg-espresso-900 shadow-sm transition-all hover:gap-3">
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4 text-brass-400" />
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-espresso-800 hover:bg-sand/50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-sand bg-cream-50 px-4 pt-4 pb-6 space-y-3">
            <Link to="/features" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-espresso-800">Features</Link>
            <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-espresso-800">Pricing</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-espresso-800">About</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-espresso-800">Contact</Link>
            <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-espresso-800">FAQ</Link>
            <div className="pt-4 border-t border-sand flex flex-col gap-3">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 rounded-xl border border-espresso-800 text-espresso-800 font-semibold">Log in</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 rounded-xl bg-espresso-800 text-cream-100 font-semibold">Start Free Trial</Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* SaaS Footer */}
      <footer className="bg-espresso-900 text-cream-200 border-t border-espresso-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            
            {/* Column 1: Brand Info */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brass-500 flex items-center justify-center text-espresso-900">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <span className="font-heading text-2xl font-bold text-cream-100">GymSuite</span>
              </div>
              <p className="text-sm text-cream-200/70 leading-relaxed">
                The complete operating system for modern gyms. Built for single independent gyms and fitness franchises.
              </p>
              <div className="text-xs text-brass-400 font-medium">
                Part of the <span className="font-semibold text-white">AcharyaWorks</span> Ecosystem
              </div>
            </div>

            {/* Column 2: Product */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-brass-400">Product</h4>
              <ul className="space-y-2 text-sm text-cream-200/80">
                <li><Link to="/features" className="hover:text-brass-400 transition-colors">Member Management</Link></li>
                <li><Link to="/features" className="hover:text-brass-400 transition-colors">Attendance Tracking</Link></li>
                <li><Link to="/features" className="hover:text-brass-400 transition-colors">Fee Collections</Link></li>
                <li><Link to="/features" className="hover:text-brass-400 transition-colors">Trainer Schedules</Link></li>
                <li><Link to="/pricing" className="hover:text-brass-400 transition-colors">Pricing & Plans</Link></li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-brass-400">Company</h4>
              <ul className="space-y-2 text-sm text-cream-200/80">
                <li><Link to="/about" className="hover:text-brass-400 transition-colors">About GymSuite</Link></li>
                <li><Link to="/contact" className="hover:text-brass-400 transition-colors">Contact Support</Link></li>
                <li><Link to="/faq" className="hover:text-brass-400 transition-colors">Frequently Asked Questions</Link></li>
                <li><a href="https://gymsuite.acharyaworks.in" className="hover:text-brass-400 transition-colors">Product Portal</a></li>
              </ul>
            </div>

            {/* Column 4: Legal & Policies */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-brass-400">Legal</h4>
              <ul className="space-y-2 text-sm text-cream-200/80">
                <li><Link to="/privacy-policy" className="hover:text-brass-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-brass-400 transition-colors">Terms of Service</Link></li>
                <li><Link to="/refund-policy" className="hover:text-brass-400 transition-colors">Refund & Cancellation</Link></li>
              </ul>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-espresso-800 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-200/60 gap-4">
            <p>© {new Date().getFullYear()} GymSuite by AcharyaWorks. All rights reserved.</p>
            <p className="flex items-center gap-1">
              <span>Domain:</span>
              <span className="font-mono text-brass-400">gymsuite.acharyaworks.in</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Building2, Crown, Users, FileText, LogOut, Menu, X, UserRound } from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Platform Overview', path: '/admin/dashboard', icon: ShieldCheck },
    { label: 'Registered Gyms', path: '/admin/gyms', icon: Building2 },
    { label: 'SaaS Subscriptions', path: '/admin/subscriptions', icon: Crown },
    { label: 'Platform Users', path: '/admin/users', icon: Users },
    { label: 'System Logs', path: '/admin/logs', icon: FileText },
    { label: 'My Profile', path: '/admin/profile', icon: UserRound },
  ];

  return (
    <div className="min-h-screen bg-cream-100 flex font-sans text-charcoal overflow-hidden h-screen">
      
      {/* Sidebar Desktop (Left Column - 3 Vertical Sections: Top Brand, Middle Nav, Bottom User Profile) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-espresso-900 text-cream-100 border-r border-espresso-800 h-screen z-30 flex-shrink-0">
        
        {/* 1. Top-Left Box: Super Admin Logo Header */}
        <div className="h-20 px-6 border-b border-espresso-800 flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-brass-500 flex items-center justify-center text-espresso-900 shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-xl font-bold tracking-tight text-cream-100">Super Admin</span>
            <span className="text-[10px] uppercase font-bold text-brass-400 tracking-wider">AcharyaWorks Core</span>
          </div>
        </div>

        {/* 2. Middle-Left Box: Navigation Links */}
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active ? 'bg-brass-500 text-espresso-900 font-semibold shadow-sm' : 'text-cream-200/80 hover:bg-espresso-800 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-espresso-900' : 'text-brass-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 3. Bottom-Left Box: Super Admin User Profile Footer */}
        <div className="h-20 px-4 border-t border-espresso-800 bg-espresso-800/40 flex items-center flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brass-500 text-espresso-900 flex items-center justify-center font-bold text-xs">
                SA
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-cream-100">Super Admin</span>
                <span className="text-[10px] text-brass-400 font-medium">AcharyaWorks</span>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 text-cream-200/60 hover:text-statusRed-text" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Column (Right Side - 2 Horizontal Sections: Top Header Bar, Bottom Main Canvas) */}
      <div className="flex-grow flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* 1. Top-Right Header Bar */}
        <header className="h-20 bg-white border-b border-sand sticky top-0 z-20 px-6 flex items-center justify-between flex-shrink-0 shadow-xs">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg border border-sand">
              <Menu className="w-6 h-6 text-espresso-800" />
            </button>
            <h1 className="text-xl font-bold font-heading text-espresso-800">
              AcharyaWorks SaaS Master Control
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brass-500/20 text-brass-700 border border-brass-400/30">
              SYSTEM ONLINE
            </span>
            <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg border border-sand text-xs font-bold text-espresso-800 hover:bg-statusRed-bg hover:text-statusRed-text">
              Exit Portal
            </button>
          </div>
        </header>

        {/* 2. Bottom-Right Main Display Area */}
        <main className="p-6 lg:p-8 flex-grow overflow-y-auto bg-cream-100">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 z-50 lg:hidden"><button type="button" aria-label="Close admin navigation overlay" className="absolute inset-0 bg-espresso-900/70" onClick={() => setSidebarOpen(false)} /><aside className="relative z-10 flex h-full w-72 max-w-[85vw] flex-col bg-espresso-900 text-cream-100 shadow-xl"><div className="flex h-20 items-center justify-between border-b border-espresso-800 px-5"><span className="font-heading text-lg font-bold">Super Admin</span><button type="button" aria-label="Close admin navigation" onClick={() => setSidebarOpen(false)}><X className="h-5 w-5" /></button></div><nav className="flex-1 space-y-1 overflow-y-auto p-4">{navItems.map((item) => { const Icon = item.icon; return <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${location.pathname === item.path ? 'bg-brass-500 text-espresso-900' : 'text-cream-200/80 hover:bg-espresso-800'}`}><Icon className="h-5 w-5" /><span>{item.label}</span></Link>; })}</nav></aside></div>}

    </div>
  );
};

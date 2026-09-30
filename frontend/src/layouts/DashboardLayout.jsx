import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, CreditCard, CalendarCheck, Award, 
  Dumbbell, Receipt, BarChart3, UserCog, Bell, Settings, 
  ShieldAlert, LogOut, Menu, X, Crown
} from 'lucide-react';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Members', path: '/members', icon: Users },
    { label: 'Membership Plans', path: '/membership-plans', icon: CreditCard },
    { label: 'Attendance', path: '/attendance', icon: CalendarCheck },
    { label: 'Payments', path: '/payments', icon: Award },
    { label: 'Trainers', path: '/trainers', icon: UserCog },
    { label: 'Workouts', path: '/workouts', icon: Dumbbell },
    { label: 'Expenses', path: '/expenses', icon: Receipt },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Staff Management', path: '/staff', icon: UserCog, ownerOnly: true },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Gym Settings', path: '/settings', icon: Settings },
    { label: 'SaaS Subscription', path: '/subscription', icon: Crown, ownerOnly: true },
  ];

  const filteredNav = navItems.filter(item => !item.ownerOnly || user?.role === 'OWNER');

  return (
    <div className="min-h-screen bg-cream-100 flex font-sans text-charcoal overflow-hidden h-screen">
      
      {/* Sidebar Desktop (Left Column - No scrollbar, compact fits all 13 items comfortably) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-espresso-800 text-cream-100 border-r border-espresso-900 h-screen z-30 flex-shrink-0 select-none">
        
        {/* 1. Top-Left Box: Brand Logo Header */}
        <div className="h-16 px-5 border-b border-espresso-900 flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-brass-500 flex items-center justify-center text-espresso-900 shadow-md">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-heading text-lg font-bold tracking-tight text-cream-100 truncate">
              {user?.gym_name || 'GymSuite'}
            </span>
            <span className="text-[9px] uppercase font-bold text-brass-400 tracking-wider">
              {user?.role || 'Staff'} Portal
            </span>
          </div>
        </div>

        {/* 2. Middle-Left Box: Compact Nav Links (Zero Scroll) */}
        <nav className="flex-grow p-2 space-y-0.5 overflow-y-auto flex flex-col no-scrollbar">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? 'bg-brass-500 text-espresso-900 shadow-xs'
                    : 'text-cream-200/80 hover:bg-espresso-900 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-espresso-900' : 'text-brass-400'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 3. Bottom-Left Box: User Profile & Logout Footer */}
        <div className="h-16 px-4 border-t border-espresso-900 bg-espresso-900/60 flex items-center flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-brass-500/20 border border-brass-400/40 text-brass-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                {user?.first_name ? user.first_name[0] : 'U'}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-cream-100 truncate">
                  {user?.first_name} {user?.last_name}
                </span>
                <span className="text-[10px] text-cream-200/60 truncate">{user?.email}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-cream-200/60 hover:text-statusRed-text hover:bg-statusRed-bg transition-colors flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* Main Content Column (Right Side - Top Header Bar, Bottom Main Canvas) */}
      <div className="flex-grow flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* 1. Top-Right Header Bar */}
        <header className="h-16 bg-white border-b border-sand sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between flex-shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-sand text-espresso-800 hover:bg-cream-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col">
              <h1 className="text-base sm:text-lg font-bold font-heading text-espresso-800">
                {user?.gym_name || 'GymSuite Operating System'}
              </h1>
              <span className="text-[11px] text-mutedGray hidden sm:inline-block">
                gymsuite.acharyaworks.in • Multi-Tenant Active
              </span>
            </div>
          </div>

          {/* SaaS Trial Status Alert Pill */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-statusAmber-bg border border-brass-400/30 text-statusAmber-text text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5 text-brass-500" />
              <span>30-Day Free Trial Active</span>
            </div>

            <div className="flex items-center gap-3 border-l border-sand pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-espresso-800">{user?.first_name} {user?.last_name}</p>
                <p className="text-[10px] text-brass-600 font-bold uppercase">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sand text-xs font-semibold text-espresso-800 hover:bg-statusRed-bg hover:text-statusRed-text transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* 2. Bottom-Right Main Display Area */}
        <main className="p-4 sm:p-6 lg:p-8 flex-grow overflow-y-auto bg-cream-100">
          <Outlet />
        </main>

      </div>

      {/* Mobile Drawer Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-espresso-900/60 backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />
          
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-espresso-800 text-cream-100 z-50 h-full">
            <div className="h-16 p-4 border-b border-espresso-900 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-brass-500 flex items-center justify-center text-espresso-900 font-bold">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <span className="font-heading text-base font-bold">{user?.gym_name || 'GymSuite'}</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg text-cream-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-grow p-3 space-y-1 overflow-y-auto no-scrollbar">
              {filteredNav.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      active ? 'bg-brass-500 text-espresso-900' : 'text-cream-200/80'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="h-16 p-4 border-t border-espresso-900 flex items-center flex-shrink-0">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-statusRed-bg text-statusRed-text text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

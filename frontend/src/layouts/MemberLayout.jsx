import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, Calendar, CreditCard, Activity, User, LogOut } from 'lucide-react';

export const MemberLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Digital Pass', path: '/member/dashboard', icon: Dumbbell },
    { label: 'Membership', path: '/member/membership', icon: CreditCard },
    { label: 'Attendance', path: '/member/attendance', icon: Calendar },
    { label: 'Workouts', path: '/member/workout', icon: Activity },
    { label: 'My Profile', path: '/member/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-cream-100 flex font-sans text-charcoal overflow-hidden h-screen">
      
      {/* Desktop Sidebar (3 Vertical Sections: Top Brand, Middle Nav, Bottom User Profile) */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-espresso-800 text-cream-100 border-r border-espresso-900 h-screen z-30 flex-shrink-0">
        
        {/* 1. Top-Left Box: Brand Header */}
        <div className="h-20 px-6 border-b border-espresso-900 flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-brass-500 flex items-center justify-center text-espresso-900 font-bold shadow-md">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-heading text-xl font-bold tracking-tight text-cream-100 truncate">
              {user?.gym_name || 'GymSuite'}
            </span>
            <span className="text-[10px] uppercase font-bold text-brass-400 tracking-wider">
              Member Portal
            </span>
          </div>
        </div>

        {/* 2. Middle-Left Box: Nav Items */}
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active ? 'bg-brass-500 text-espresso-900 font-semibold shadow-sm' : 'text-cream-200/80 hover:bg-espresso-900 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-espresso-900' : 'text-brass-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 3. Bottom-Left Box: Profile & Logout Footer */}
        <div className="h-20 px-4 border-t border-espresso-900 bg-espresso-900/60 flex items-center flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-brass-500/20 text-brass-400 flex items-center justify-center font-bold text-sm">
                {user?.first_name ? user.first_name[0] : 'M'}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-cream-100 truncate">
                  {user?.first_name} {user?.last_name}
                </span>
                <span className="text-[10px] text-cream-200/60 truncate">{user?.email}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 text-cream-200/60 hover:text-statusRed-text" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Right Column (2 Horizontal Sections: Top Header Bar, Bottom Main Canvas) */}
      <div className="flex-grow flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* 1. Top-Right Header Bar */}
        <header className="h-20 bg-white border-b border-sand sticky top-0 z-20 px-6 flex items-center justify-between flex-shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brass-500 text-espresso-900 flex items-center justify-center font-bold md:hidden">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold text-espresso-800">{user?.gym_name || 'GymSuite'}</h1>
              <p className="text-[10px] text-brass-600 font-bold uppercase tracking-wider">Member Access Pass</p>
            </div>
          </div>

          <button onClick={handleLogout} className="px-3.5 py-1.5 rounded-lg border border-sand text-xs font-bold text-espresso-800 hover:bg-statusRed-bg hover:text-statusRed-text">
            Logout
          </button>
        </header>

        {/* 2. Bottom-Right Main Display Canvas */}
        <main className="p-4 sm:p-6 lg:p-8 flex-grow overflow-y-auto bg-cream-100 pb-20 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation Bar for Mobile Devices */}
      <nav className="fixed bottom-0 left-0 right-0 bg-espresso-800 border-t border-espresso-900 flex justify-around py-2 z-40 md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
                active ? 'text-brass-400 font-bold' : 'text-cream-200/70 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
};

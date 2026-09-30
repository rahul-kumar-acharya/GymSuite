import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, Users, ClipboardList, User, LogOut, Menu, X } from 'lucide-react';

export const TrainerLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Trainer Dashboard', path: '/trainer/dashboard', icon: Dumbbell },
    { label: 'Assigned Clients', path: '/trainer/members', icon: Users },
    { label: 'Workout Plans', path: '/trainer/workouts', icon: ClipboardList },
    { label: 'My Profile', path: '/trainer/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-cream-100 flex font-sans text-charcoal overflow-hidden h-screen">
      
      {/* Left Sidebar (3 Vertical Sections: Top Brand, Middle Nav, Bottom Profile) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white text-espresso-800 border-r border-sand h-screen z-30 flex-shrink-0">
        
        {/* 1. Top-Left Box: Brand Header */}
        <div className="h-20 px-6 border-b border-sand flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-espresso-800 flex items-center justify-center text-brass-500 shadow-md">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-heading text-xl font-bold tracking-tight text-espresso-800 truncate">
              {user?.gym_name || 'GymSuite'}
            </span>
            <span className="text-[10px] uppercase font-bold text-brass-600 tracking-wider">
              Trainer Portal
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
                  active ? 'bg-espresso-800 text-cream-100 font-semibold shadow-sm' : 'text-espresso-800 hover:bg-cream-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-brass-400' : 'text-espresso-800'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 3. Bottom-Left Box: User Profile & Logout */}
        <div className="h-20 px-4 border-t border-sand bg-cream-50 flex items-center flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-espresso-800 text-brass-400 flex items-center justify-center font-bold text-sm">
                {user?.first_name ? user.first_name[0] : 'T'}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-espresso-800 truncate">
                  Coach {user?.first_name}
                </span>
                <span className="text-[10px] text-mutedGray truncate">{user?.email}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 text-mutedGray hover:text-statusRed-text" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Right Column (2 Horizontal Sections: Top Header, Bottom Content Canvas) */}
      <div className="flex-grow flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* 1. Top-Right Header Bar */}
        <header className="h-20 bg-white border-b border-sand sticky top-0 z-20 px-6 flex items-center justify-between flex-shrink-0 shadow-xs">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold font-heading text-espresso-800">
              Trainer Command Dashboard
            </h1>
            <span className="text-xs text-mutedGray">
              GymSuite Trainer Management System
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" aria-label="Open trainer navigation" onClick={() => setSidebarOpen(true)} className="lg:hidden rounded-lg border border-sand p-2 text-espresso-800"><Menu className="h-5 w-5" /></button>
            <button onClick={handleLogout} className="px-3.5 py-1.5 rounded-lg border border-sand text-xs font-bold text-espresso-800 hover:bg-statusRed-bg hover:text-statusRed-text">
              Logout
            </button>
          </div>
        </header>

        {/* 2. Bottom-Right Main Content Display */}
        <main className="p-6 lg:p-8 flex-grow overflow-y-auto bg-cream-100">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 z-50 lg:hidden"><button type="button" aria-label="Close trainer navigation overlay" className="absolute inset-0 bg-espresso-900/60" onClick={() => setSidebarOpen(false)} /><aside className="relative z-10 flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl"><div className="flex h-20 items-center justify-between border-b border-sand px-5"><span className="font-heading text-lg font-bold text-espresso-800">Trainer Portal</span><button type="button" aria-label="Close trainer navigation" onClick={() => setSidebarOpen(false)}><X className="h-5 w-5" /></button></div><nav className="flex-1 space-y-1 overflow-y-auto p-4">{navItems.map((item) => { const Icon = item.icon; return <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${location.pathname === item.path ? 'bg-espresso-800 text-cream-100' : 'text-espresso-800 hover:bg-cream-100'}`}><Icon className="h-5 w-5" /><span>{item.label}</span></Link>; })}</nav></aside></div>}

    </div>
  );
};

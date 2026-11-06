import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import ToastContainer from '../common/ToastContainer';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  PenSquare,
  FolderTree,
  UserCheck,
} from 'lucide-react';

export const DashboardLayout = () => {
  const { user, userProfile } = useAuth();
  const location = useLocation();

  const navLinks = [
    {
      to: '/dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      to: '/dashboard/my-blogs',
      label: 'My Articles',
      icon: BookOpen,
      count: userProfile?.posts?.length,
    },
    {
      to: '/dashboard/create',
      label: 'Write Article',
      icon: PenSquare,
    },
    {
      to: '/dashboard/categories',
      label: 'Categories',
      icon: FolderTree,
    },
    {
      to: '/dashboard/profile',
      label: 'Account & Social',
      icon: UserCheck,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-canvas-subtle text-content selection:bg-brand-100 selection:text-brand-800">
      <Navbar />
      <ToastContainer />

      {/* Main Dashboard Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <aside className="lg:col-span-3 bg-white border border-border rounded-xl p-5 shadow-subtle space-y-6">
            {/* User Mini Profile */}
            <div className="flex items-center gap-3 pb-5 border-b border-border-subtle">
              <Avatar
                src={userProfile?.profilePicture || user?.profilePicture}
                name={user?.username || 'User'}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-semibold text-content truncate">{user?.username}</h3>
                </div>
                <p className="text-xs text-content-secondary truncate">{user?.email}</p>
                <div className="mt-1 flex items-center gap-1">
                  <Badge variant="neutral" size="xs">
                    {userProfile?.accountLevel || user?.accountLevel || 'Bronze'}
                  </Badge>
                  <Badge variant={user?.role === 'admin' ? 'brand' : 'neutral'} size="xs">
                    {user?.role || 'user'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = link.exact
                  ? location.pathname === link.to
                  : location.pathname.startsWith(link.to);

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-content text-white font-semibold shadow-subtle'
                        : 'text-content-secondary hover:text-content hover:bg-canvas-subtle'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </div>
                    {link.count !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          isActive ? 'bg-neutral-800 text-white' : 'bg-canvas-surface text-content-secondary'
                        }`}
                      >
                        {link.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Content Area */}
          <main className="lg:col-span-9 bg-white border border-border rounded-xl p-6 sm:p-8 shadow-subtle min-h-[500px]">
            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;

import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import ToastContainer from '../common/ToastContainer';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authApi } from '../../api/auth';
import {
  LayoutDashboard,
  BookOpen,
  PenSquare,
  FolderTree,
  UserCheck,
  AlertTriangle,
  Mail,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const DashboardLayout = () => {
  const { user, userProfile, refreshProfile } = useAuth();
  const { success, error } = useToast();
  const location = useLocation();
  const [isSendingVerify, setIsSendingVerify] = useState(false);

  const isVerified = userProfile?.isVerified ?? user?.isVerified;

  const handleSendVerification = async () => {
    setIsSendingVerify(true);
    try {
      const res = await authApi.sendVerificationEmail();
      success(res?.message || 'Verification email sent! Check your inbox.');
    } catch (err) {
      error(err.message || 'Failed to send verification email');
    } finally {
      setIsSendingVerify(false);
    }
  };

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

      {/* Account Verification Warning Banner */}
      {!isVerified && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                Your account is currently <strong>unverified</strong>. Please verify your email to unlock all publishing features.
              </span>
            </div>
            <button
              onClick={handleSendVerification}
              disabled={isSendingVerify}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-amber-300 rounded-md font-medium text-amber-800 hover:bg-amber-100 transition-colors shadow-2xs disabled:opacity-50"
            >
              <Mail className="w-3.5 h-3.5" />
              {isSendingVerify ? 'Sending...' : 'Send Verification Email'}
            </button>
          </div>
        </div>
      )}

      {/* Main Dashboard Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  {isVerified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" title="Verified Account" />
                  )}
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


import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full bg-canvas-subtle border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-content text-white flex items-center justify-center font-bold text-sm">
                B
              </div>
              <span className="font-semibold text-base tracking-tight text-content">
                Blogi<span className="text-brand-600">Tech</span>
              </span>
            </Link>
            <p className="text-xs text-content-secondary max-w-sm leading-relaxed">
              A minimalist, high-signal publishing platform engineered for developers, architects, and thinkers sharing deep technical knowledge and ideas.
            </p>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-content uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-xs text-content-secondary">
              <li>
                <Link to="/blogs" className="hover:text-content transition-colors">
                  Latest Articles
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-content transition-colors">
                  All Categories
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-content transition-colors">
                  Search Platform
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-content uppercase tracking-wider">Account</h4>
            <ul className="space-y-2 text-xs text-content-secondary">
              <li>
                <Link to="/login" className="hover:text-content transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-content transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-content transition-colors">
                  Creator Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-content-muted">
          <p>© {new Date().getFullYear()} BlogiTech. Handcrafted for modern engineers.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-content transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-content transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-content transition-colors cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


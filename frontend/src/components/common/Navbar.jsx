import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Avatar from './Avatar';
import Badge from './Badge';
import {
  PenSquare,
  Search,
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  User as UserIcon,
  FolderTree,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    info('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-content text-white flex items-center justify-center font-bold text-base transition-transform group-hover:scale-105 shadow-subtle">
              B
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-lg tracking-tight text-content leading-none">
                Blogi<span className="text-brand-600">Tech</span>
              </span>
              <span className="text-[10px] text-content-secondary tracking-wider uppercase font-medium mt-0.5">
                Engineering & Ideas
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-content-secondary">
            <Link
              to="/blogs"
              className={`px-3 py-1.5 rounded-md hover:text-content hover:bg-canvas-subtle transition-colors ${
                location.pathname === '/blogs' ? 'text-content font-semibold bg-canvas-subtle' : ''
              }`}
            >
              Articles
            </Link>
            <Link
              to="/categories"
              className={`px-3 py-1.5 rounded-md hover:text-content hover:bg-canvas-subtle transition-colors ${
                location.pathname === '/categories' ? 'text-content font-semibold bg-canvas-subtle' : ''
              }`}
            >
              Categories
            </Link>
          </nav>
        </div>

        {/* Global Search Bar (Desktop) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden sm:flex items-center flex-1 max-w-xs relative text-content-secondary focus-within:text-content"
        >
          <Search className="w-4 h-4 absolute left-3 pointer-events-none text-content-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles, topics..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-canvas-subtle border border-border rounded-lg placeholder-content-muted focus:outline-none focus:border-brand-600 focus:bg-white transition-all shadow-2xs"
          />
        </form>

        {/* Right Action Items */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Write Post Button */}
              <Link
                to="/dashboard/create"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-content text-white hover:bg-neutral-800 transition-colors shadow-subtle"
              >
                <PenSquare className="w-3.5 h-3.5" />
                <span>Write</span>
              </Link>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-canvas-subtle border border-transparent hover:border-border transition-all"
                  aria-expanded={isDropdownOpen}
                >
                  <Avatar
                    src={user?.profilePicture}
                    name={user?.username || 'User'}
                    size="sm"
                  />
                  <span className="hidden lg:inline text-xs font-medium text-content max-w-[100px] truncate">
                    {user?.username}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-content-muted" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-border rounded-xl shadow-elevated py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2.5 border-b border-border-subtle">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-content truncate">{user?.username}</p>
                        <Badge variant="brand" size="xs">
                          {user?.role || 'user'}
                        </Badge>
                      </div>
                      <p className="text-xs text-content-secondary truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-content hover:bg-canvas-subtle transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-content-muted" />
                        Dashboard
                      </Link>
                      <Link
                        to="/dashboard/my-blogs"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-content hover:bg-canvas-subtle transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-content-muted" />
                        My Articles
                      </Link>
                      <Link
                        to="/dashboard/create"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-content hover:bg-canvas-subtle transition-colors"
                      >
                        <PenSquare className="w-4 h-4 text-content-muted" />
                        New Article
                      </Link>
                      <Link
                        to="/dashboard/categories"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-content hover:bg-canvas-subtle transition-colors"
                      >
                        <FolderTree className="w-4 h-4 text-content-muted" />
                        Categories
                      </Link>
                      <Link
                        to="/dashboard/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-content hover:bg-canvas-subtle transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-content-muted" />
                        Account & Profile
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-border-subtle">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50/70 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-medium text-content-secondary hover:text-content transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-medium rounded-lg bg-content text-white hover:bg-neutral-800 transition-colors shadow-subtle"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-1.5 rounded-lg text-content-secondary hover:text-content hover:bg-canvas-subtle border border-border"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-content-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, topics..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-canvas-subtle border border-border rounded-lg placeholder-content-muted focus:outline-none focus:border-brand-600 focus:bg-white"
            />
          </form>

          <nav className="flex flex-col space-y-1">
            <Link
              to="/blogs"
              className="px-3 py-2 text-sm font-medium text-content hover:bg-canvas-subtle rounded-md"
            >
              All Articles
            </Link>
            <Link
              to="/categories"
              className="px-3 py-2 text-sm font-medium text-content hover:bg-canvas-subtle rounded-md"
            >
              Categories
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard/create"
                  className="px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-md flex items-center gap-2"
                >
                  <PenSquare className="w-4 h-4" />
                  Write New Article
                </Link>
                <Link
                  to="/dashboard"
                  className="px-3 py-2 text-sm font-medium text-content hover:bg-canvas-subtle rounded-md"
                >
                  Dashboard
                </Link>
                <Link
                  to="/dashboard/my-blogs"
                  className="px-3 py-2 text-sm font-medium text-content hover:bg-canvas-subtle rounded-md"
                >
                  My Articles
                </Link>
                <Link
                  to="/dashboard/profile"
                  className="px-3 py-2 text-sm font-medium text-content hover:bg-canvas-subtle rounded-md"
                >
                  Profile & Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  className="w-full py-2 text-center text-sm font-medium border border-border rounded-lg hover:bg-canvas-subtle"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="w-full py-2 text-center text-sm font-medium bg-content text-white rounded-lg hover:bg-neutral-800"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;


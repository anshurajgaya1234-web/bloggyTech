import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LogIn, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!username.trim() || !password.trim()) {
      setFormError('Please fill in both your username and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(username.trim(), password);
      success('Welcome back!');
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Invalid username or password.');
      error(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-border rounded-2xl p-8 sm:p-10 shadow-elevated space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-content text-white font-bold text-lg mb-2 shadow-subtle">
            B
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-content">Sign in to BlogiTech</h1>
          <p className="text-xs text-content-secondary">
            Enter your credentials to access your creator dashboard.
          </p>
        </div>

        {formError && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-content block">Username</label>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setFormError('');
              }}
              placeholder="e.g. alexdev"
              className="w-full px-3.5 py-2.5 text-xs bg-canvas-subtle border border-border rounded-lg placeholder-content-muted focus:outline-none focus:border-brand-600 focus:bg-white transition-all shadow-2xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-content">Password</label>
              <Link
                to="/forgot-password"
                className="text-[11px] font-medium text-brand-600 hover:text-brand-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFormError('');
              }}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-xs bg-canvas-subtle border border-border rounded-lg placeholder-content-muted focus:outline-none focus:border-brand-600 focus:bg-white transition-all shadow-2xs"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 text-xs font-semibold rounded-lg bg-content text-white hover:bg-neutral-800 transition-colors shadow-subtle disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="pt-4 border-t border-border text-center text-xs text-content-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { useToast } from '../../context/ToastContext';
import { KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

export const ResetPasswordPage = () => {
  const { resetToken } = useParams();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!password.trim()) {
      setFormError('Please enter a new password.');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.resetPassword(resetToken, password);
      setIsSuccess(true);
      success('Password successfully reset! You can now log in.');
    } catch (err) {
      setFormError(err.message || 'Password reset failed. The link may have expired or is invalid.');
      error(err.message || 'Reset failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white border border-border rounded-2xl p-8 sm:p-10 shadow-elevated text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-content">Password Updated</h2>
          <p className="text-xs text-content-secondary leading-relaxed">
            Your new password has been established. You can now log in with your updated credentials.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full py-2.5 text-xs font-semibold rounded-lg bg-content text-white hover:bg-neutral-800 transition-colors shadow-subtle"
            >
              Log In Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-border rounded-2xl p-8 sm:p-10 shadow-elevated space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-content">Set New Password</h1>
          <p className="text-xs text-content-secondary mt-1">
            Create a secure new password for your account.
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
            <label className="text-xs font-semibold text-content block">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFormError('');
              }}
              placeholder="At least 6 characters"
              className="w-full px-3.5 py-2.5 text-xs bg-canvas-subtle border border-border rounded-lg placeholder-content-muted focus:outline-none focus:border-brand-600 focus:bg-white transition-all shadow-2xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-content block">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setFormError('');
              }}
              placeholder="Re-enter new password"
              className="w-full px-3.5 py-2.5 text-xs bg-canvas-subtle border border-border rounded-lg placeholder-content-muted focus:outline-none focus:border-brand-600 focus:bg-white transition-all shadow-2xs"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 text-xs font-semibold rounded-lg bg-content text-white hover:bg-neutral-800 transition-colors shadow-subtle disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            {isSubmitting ? 'Updating Password...' : 'Save New Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;


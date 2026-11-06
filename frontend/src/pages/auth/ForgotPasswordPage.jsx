import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { useToast } from '../../context/ToastContext';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const { success, error } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim()) {
      setFormError('Please enter your registered email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.forgotPassword(email.trim());
      setIsSent(true);
      success('Password reset email dispatched!');
    } catch (err) {
      setFormError(err.message || 'Could not dispatch password reset link.');
      error(err.message || 'Error sending reset token');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white border border-border rounded-2xl p-8 sm:p-10 shadow-elevated text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-content">Check Your Inbox</h2>
          <p className="text-xs text-content-secondary leading-relaxed">
            We have dispatched a password reset link to <strong>{email}</strong>. Please check your email and click the link to reset your password.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full py-2.5 text-xs font-semibold rounded-lg border border-border bg-white text-content hover:bg-canvas-subtle transition-colors shadow-2xs"
            >
              Return to Sign In
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
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-content-secondary hover:text-content mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-content">Reset Your Password</h1>
          <p className="text-xs text-content-secondary mt-1">
            Enter your email address and we'll send you a link to reset your password.
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
            <label className="text-xs font-semibold text-content block">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFormError('');
              }}
              placeholder="alex@example.com"
              className="w-full px-3.5 py-2.5 text-xs bg-canvas-subtle border border-border rounded-lg placeholder-content-muted focus:outline-none focus:border-brand-600 focus:bg-white transition-all shadow-2xs"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 text-xs font-semibold rounded-lg bg-content text-white hover:bg-neutral-800 transition-colors shadow-subtle disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;


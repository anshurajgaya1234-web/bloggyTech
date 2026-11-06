import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const VerifyAccountPage = () => {
  const { verifyToken } = useParams();
  const { refreshProfile } = useAuth();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleVerify = async () => {
      if (!verifyToken) {
        setStatus('error');
        setErrorMessage('No verification token provided in URL.');
        return;
      }
      try {
        await authApi.verifyAccount(verifyToken);
        setStatus('success');
        await refreshProfile();
      } catch (err) {
        setStatus('error');
        setErrorMessage(
          err.message || 'Verification token is invalid, expired, or has already been used.'
        );
      }
    };

    handleVerify();
  }, [verifyToken]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-border rounded-2xl p-8 sm:p-10 shadow-elevated text-center space-y-6">
        {status === 'verifying' && (
          <div className="space-y-4">
            <LoadingSpinner size="lg" text="Verifying your account token..." />
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-5">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-content">Account Verified!</h1>
            <p className="text-xs text-content-secondary leading-relaxed">
              Your account has been officially verified. You now have full access to publish articles, create categories, and engage across the community.
            </p>
            <div className="pt-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold rounded-lg bg-content text-white hover:bg-neutral-800 transition-colors shadow-subtle"
              >
                Go to Creator Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-5">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-content">Verification Failed</h1>
            <p className="text-xs text-content-secondary leading-relaxed">
              {errorMessage}
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center w-full py-2.5 text-xs font-semibold rounded-lg bg-content text-white hover:bg-neutral-800 transition-colors shadow-subtle"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyAccountPage;


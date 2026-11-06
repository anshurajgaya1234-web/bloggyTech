import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderClass = 'border-border';
        let bgClass = 'bg-white';
        let iconClass = 'text-brand-600';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          iconClass = 'text-emerald-600';
          borderClass = 'border-emerald-200';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          iconClass = 'text-red-600';
          borderClass = 'border-red-200';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          iconClass = 'text-amber-600';
          borderClass = 'border-amber-200';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg border shadow-elevated ${bgClass} ${borderClass} transition-all duration-200`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconClass}`} />
            <div className="flex-1 text-sm text-content font-medium leading-snug">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-content-muted hover:text-content transition-colors p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;


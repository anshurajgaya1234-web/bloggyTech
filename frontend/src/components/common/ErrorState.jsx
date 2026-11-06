import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while fetching data.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center border border-red-200 rounded-xl bg-red-50/50 my-6 max-w-lg mx-auto">
      <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-content mb-1">{title}</h3>
      <p className="text-sm text-content-secondary max-w-sm mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-border bg-white text-content hover:bg-canvas-subtle transition-colors shadow-subtle"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;


import React from 'react';

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-7 h-7 border-2',
    lg: 'w-10 h-10 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-border border-t-brand-600 animate-spin`}
      />
      {text && <p className="text-xs text-content-secondary font-medium tracking-wide">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;


import React from 'react';

export const Avatar = ({ src, name = 'User', size = 'md', className = '' }) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-medium',
    lg: 'w-14 h-14 text-base font-semibold',
    xl: 'w-20 h-20 text-xl font-semibold',
  };

  const getInitials = (str) => {
    if (!str) return 'U';
    return str
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0 bg-canvas-surface border border-border select-none ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
    >
      {src && src.trim() !== '' ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <span className="text-content-secondary">{getInitials(name)}</span>
      )}
    </div>
  );
};

export default Avatar;


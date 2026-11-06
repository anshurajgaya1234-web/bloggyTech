import React from 'react';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = BookOpen,
  title = 'No content found',
  description = 'There are no items to display at this moment.',
  actionLabel,
  actionLink,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-xl bg-canvas-subtle my-6 max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-full bg-canvas-surface flex items-center justify-center text-content-secondary mb-4 border border-border">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-content mb-1">{title}</h3>
      <p className="text-sm text-content-secondary max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-content text-white hover:bg-neutral-800 transition-colors shadow-subtle"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionLink && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-content text-white hover:bg-neutral-800 transition-colors shadow-subtle"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;


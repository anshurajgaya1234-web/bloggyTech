import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="border border-border rounded-xl p-5 bg-white shadow-subtle animate-pulse flex flex-col gap-4">
      <div className="w-full h-44 bg-canvas-surface rounded-lg" />
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-canvas-surface" />
        <div className="w-24 h-3 bg-canvas-surface rounded" />
        <div className="w-16 h-3 bg-canvas-surface rounded ml-auto" />
      </div>
      <div className="space-y-2">
        <div className="w-3/4 h-5 bg-canvas-surface rounded" />
        <div className="w-full h-4 bg-canvas-surface rounded" />
        <div className="w-5/6 h-4 bg-canvas-surface rounded" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
        <div className="w-16 h-4 bg-canvas-surface rounded" />
        <div className="flex gap-2">
          <div className="w-6 h-4 bg-canvas-surface rounded" />
          <div className="w-6 h-4 bg-canvas-surface rounded" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonList = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default SkeletonCard;


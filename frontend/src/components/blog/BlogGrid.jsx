import React from 'react';
import BlogCard from './BlogCard';
import { SkeletonList } from '../common/SkeletonCard';
import EmptyState from '../common/EmptyState';

export const BlogGrid = ({
  posts = [],
  isLoading = false,
  emptyTitle = 'No articles found',
  emptyDescription = 'There are no published articles matching this criteria right now.',
  emptyActionLabel,
  emptyActionLink,
}) => {
  if (isLoading) {
    return <SkeletonList count={6} />;
  }

  if (!posts || posts.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        actionLink={emptyActionLink}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default BlogGrid;


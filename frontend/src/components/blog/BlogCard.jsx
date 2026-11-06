import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { ThumbsUp, MessageSquare, Sparkles, Clock, Calendar } from 'lucide-react';

export const BlogCard = ({ post }) => {
  if (!post) return null;

  const author = post.author || {};
  const category = post.category || {};
  const authorName = typeof author === 'object' ? author.username : 'Anonymous';
  const authorId = typeof author === 'object' ? author._id : author;
  const categoryName = typeof category === 'object' ? category.name : 'General';
  const categoryId = typeof category === 'object' ? category._id : category;

  // Format date
  const dateStr = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  // Estimate reading time (assuming 200 words per minute)
  const words = post.content ? post.content.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(words / 200));

  // Strip simple markdown or HTML tags for excerpt preview
  const excerpt = post.content
    ? post.content.replace(/[#*`_>\[\]]/g, '').slice(0, 150) + '...'
    : 'No content available.';

  return (
    <article className="group flex flex-col bg-white border border-border rounded-xl overflow-hidden shadow-subtle hover:shadow-card hover:border-border-dark transition-all duration-200">
      {/* Cover Image */}
      <Link to={`/blogs/${post._id}`} className="relative block aspect-[16/9] overflow-hidden bg-canvas-surface">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-canvas-surface text-content-muted text-xs">
            No cover image
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Read Time */}
          <div className="flex items-center justify-between gap-2 mb-3">
            {categoryId ? (
              <Link to={`/category/${categoryId}`}>
                <Badge variant="brand" size="xs">
                  {categoryName}
                </Badge>
              </Link>
            ) : (
              <Badge variant="neutral" size="xs">
                {categoryName}
              </Badge>
            )}

            <span className="flex items-center gap-1 text-[11px] text-content-muted">
              <Clock className="w-3 h-3" />
              {readTime} min read
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-base text-content group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug mb-2">
            <Link to={`/blogs/${post._id}`}>{post.title}</Link>
          </h3>

          {/* Excerpt */}
          <p className="text-xs text-content-secondary line-clamp-3 leading-relaxed mb-4">
            {excerpt}
          </p>
        </div>

        {/* Footer: Author & Metrics */}
        <div className="pt-4 border-t border-border-subtle flex items-center justify-between gap-2">
          {/* Author */}
          <Link
            to={authorId ? `/author/${authorId}` : '#'}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity min-w-0"
          >
            <Avatar
              src={author.profilePicture}
              name={authorName}
              size="xs"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-content truncate max-w-[110px]">
                {authorName}
              </span>
              <span className="text-[10px] text-content-muted">{dateStr}</span>
            </div>
          </Link>

          {/* Stats */}
          <div className="flex items-center gap-3 text-content-secondary text-xs">
            {post.claps > 0 && (
              <span className="flex items-center gap-1 text-content-secondary" title="Claps">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] font-medium">{post.claps}</span>
              </span>
            )}
            <span className="flex items-center gap-1 text-content-muted" title="Likes">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span className="text-[11px]">{post.likes?.length || 0}</span>
            </span>
            <span className="flex items-center gap-1 text-content-muted" title="Comments">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="text-[11px]">{post.comments?.length || 0}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;


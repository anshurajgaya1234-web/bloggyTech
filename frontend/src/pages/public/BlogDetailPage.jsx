import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postsApi } from '../../api/posts';
import { usersApi } from '../../api/users';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import ReactionBar from '../../components/blog/ReactionBar';
import CommentSection from '../../components/blog/CommentSection';
import { Calendar, Clock, ArrowLeft, UserPlus, UserCheck } from 'lucide-react';

export const BlogDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { success, error, info } = useToast();

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const fetchPostDetails = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await postsApi.getPost(id);
      if (res?.post) {
        setPost(res.post);

        // Record profile view of author if authenticated
        const authorId =
          typeof res.post.author === 'object' ? res.post.author?._id : res.post.author;
        if (isAuthenticated && authorId && authorId !== user?._id) {
          try {
            await usersApi.viewOtherProfile(authorId);
          } catch {
            // Already viewed or ignore
          }
        }
      } else {
        setFetchError('Article not found or has been removed.');
      }
    } catch (err) {
      setFetchError(err.message || 'Failed to load article');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [id]);

  const author = post?.author || {};
  const authorName = typeof author === 'object' ? author.username : 'Anonymous';
  const authorId = typeof author === 'object' ? author._id : author;
  const category = post?.category || {};
  const categoryName = typeof category === 'object' ? category.name : 'General';
  const categoryId = typeof category === 'object' ? category._id : category;

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      info('Please sign in to follow authors');
      return;
    }
    if (!authorId || authorId === user?._id) return;

    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        await usersApi.unfollowUser(authorId);
        setIsFollowing(false);
        info(`Unfollowed ${authorName}`);
      } else {
        await usersApi.followUser(authorId);
        setIsFollowing(true);
        success(`Now following ${authorName}`);
      }
    } catch (err) {
      error(err.message || 'Action failed');
    } finally {
      setIsFollowLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <LoadingSpinner text="Loading article..." size="lg" />
      </div>
    );
  }

  if (fetchError || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <ErrorState
          title="Article Not Available"
          message={fetchError || 'Could not locate the requested article.'}
          onRetry={fetchPostDetails}
        />
        <div className="text-center mt-6">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to all articles
          </Link>
        </div>
      </div>
    );
  }

  // Format date & estimate read time
  const dateStr = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';
  const words = post.content ? post.content.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(words / 200));

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Back button & Category */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-content-secondary hover:text-content transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to articles
        </Link>
        {categoryId && (
          <Link to={`/category/${categoryId}`}>
            <Badge variant="brand" size="sm">
              {categoryName}
            </Badge>
          </Link>
        )}
      </div>

      {/* Article Title */}
      <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-content leading-tight mb-6">
        {post.title}
      </h1>

      {/* Author and Metadata Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border mb-8">
        <div className="flex items-center gap-3">
          <Link to={authorId ? `/author/${authorId}` : '#'}>
            <Avatar
              src={author.profilePicture}
              name={authorName}
              size="md"
            />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link
                to={authorId ? `/author/${authorId}` : '#'}
                className="text-sm font-semibold text-content hover:text-brand-600 transition-colors"
              >
                {authorName}
              </Link>
              {isAuthenticated && authorId && authorId !== user?._id && (
                <button
                  onClick={handleFollowToggle}
                  disabled={isFollowLoading}
                  className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border transition-colors ${
                    isFollowing
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-border bg-white text-content hover:bg-canvas-subtle'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-3 h-3" /> Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3" /> Follow
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-content-muted mt-0.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {dateStr}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {readTime} min read
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Cover Image */}
      {post.image && (
        <div className="mb-10 rounded-xl overflow-hidden border border-border shadow-subtle aspect-[16/9] bg-canvas-surface">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Article Body Content */}
      <div className="prose prose-neutral max-w-none text-content leading-relaxed text-base font-normal space-y-5">
        {post.content.split('\n\n').map((paragraph, index) => {
          if (!paragraph.trim()) return null;
          return (
            <p key={index} className="text-content leading-7 text-sm sm:text-base">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Article reactions */}
      <ReactionBar post={post} onPostUpdated={fetchPostDetails} />

      {/* Author Bio Card */}
      {authorId && (
        <div className="p-6 rounded-xl border border-border bg-canvas-subtle my-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar
              src={author.profilePicture}
              name={authorName}
              size="lg"
            />
            <div>
              <h4 className="text-sm font-semibold text-content">Written by {authorName}</h4>
              <p className="text-xs text-content-secondary mt-1 max-w-md">
                {author.bio || 'Contributing insights and technical architectures on BlogiTech.'}
              </p>
            </div>
          </div>
          <Link
            to={`/author/${authorId}`}
            className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-border bg-white text-content hover:bg-canvas-surface transition-colors shadow-2xs whitespace-nowrap"
          >
            View Profile
          </Link>
        </div>
      )}

      {/* Interactive Comments Section */}
      <CommentSection
        postId={post._id}
        initialComments={post.comments || []}
        onCommentAdded={fetchPostDetails}
      />
    </article>
  );
};

export default BlogDetailPage;

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { postsApi } from '../../api/posts';
import { ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ReactionBar = ({ post, onPostUpdated }) => {
  const { user, isAuthenticated } = useAuth();
  const { success, error, info } = useToast();
  const navigate = useNavigate();

  const [claps, setClaps] = useState(post?.claps || 0);
  const [likesCount, setLikesCount] = useState(post?.likes?.length || 0);
  const [dislikesCount, setDislikesCount] = useState(post?.dislike?.length || 0);
  const [hasLiked, setHasLiked] = useState(() => {
    if (!user || !post?.likes) return false;
    return post.likes.some((id) => (typeof id === 'object' ? id._id === user._id : id === user._id));
  });
  const [hasDisliked, setHasDisliked] = useState(() => {
    if (!user || !post?.dislike) return false;
    return post.dislike.some((id) => (typeof id === 'object' ? id._id === user._id : id === user._id));
  });
  const [isActing, setIsActing] = useState(false);

  const requireAuth = () => {
    if (!isAuthenticated) {
      info('Please sign in to react to this article');
      navigate('/login');
      return false;
    }
    return true;
  };

  const handleClap = async () => {
    if (!requireAuth()) return;
    try {
      setClaps((prev) => prev + 1);
      const res = await postsApi.clapPost(post._id);
      if (res?.updatedPost) {
        setClaps(res.updatedPost.claps);
      }
    } catch (err) {
      setClaps((prev) => Math.max(0, prev - 1));
      error(err.message || 'Failed to clap');
    }
  };

  const handleLike = async () => {
    if (!requireAuth()) return;
    if (isActing) return;
    setIsActing(true);
    try {
      await postsApi.likePost(post._id);
      setHasLiked(true);
      setLikesCount((prev) => (hasLiked ? prev : prev + 1));
      if (hasDisliked) {
        setHasDisliked(false);
        setDislikesCount((prev) => Math.max(0, prev - 1));
      }
      success('Liked article');
      if (onPostUpdated) onPostUpdated();
    } catch (err) {
      error(err.message || 'Failed to like');
    } finally {
      setIsActing(false);
    }
  };

  const handleDislike = async () => {
    if (!requireAuth()) return;
    if (isActing) return;
    setIsActing(true);
    try {
      await postsApi.dislikePost(post._id);
      setHasDisliked(true);
      setDislikesCount((prev) => (hasDisliked ? prev : prev + 1));
      if (hasLiked) {
        setHasLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));
      }
      info('Disliked article');
      if (onPostUpdated) onPostUpdated();
    } catch (err) {
      error(err.message || 'Failed to dislike');
    } finally {
      setIsActing(false);
    }
  };

  return (
    <div className="my-8 border-y border-border py-5">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Claps */}
        <button
          onClick={handleClap}
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:border-amber-300 hover:bg-amber-50/50 text-content transition-all"
          title="Clap for this article"
        >
          <Sparkles className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold text-content">{claps}</span>
        </button>

        {/* Like */}
        <button
          onClick={handleLike}
          disabled={isActing}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs font-medium ${
            hasLiked
              ? 'bg-brand-50 border-brand-200 text-brand-700'
              : 'border-border hover:bg-canvas-subtle text-content-secondary hover:text-content'
          }`}
          title="Like article"
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'text-brand-600 fill-brand-600' : ''}`} />
          <span>{likesCount}</span>
        </button>

        {/* Dislike */}
        <button
          onClick={handleDislike}
          disabled={isActing}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs font-medium ${
            hasDisliked
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'border-border hover:bg-canvas-subtle text-content-secondary hover:text-content'
          }`}
          title="Dislike article"
        >
          <ThumbsDown className={`w-3.5 h-3.5 ${hasDisliked ? 'text-red-600 fill-red-600' : ''}`} />
          <span>{dislikesCount}</span>
        </button>
      </div>
    </div>
  );
};

export default ReactionBar;

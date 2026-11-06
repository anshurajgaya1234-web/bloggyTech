import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { postsApi } from '../../api/posts';
import ConfirmModal from '../../components/common/ConfirmModal';
import ScheduleModal from '../../components/blog/ScheduleModal';
import Badge from '../../components/common/Badge';
import {
  PenSquare,
  Trash2,
  Edit2,
  Calendar,
  ExternalLink,
  BookOpen,
  Sparkles,
  ThumbsUp,
  MessageSquare,
} from 'lucide-react';

export const MyBlogsPage = () => {
  const { userProfile, refreshProfile } = useAuth();
  const { success, error } = useToast();

  const [posts, setPosts] = useState([]);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Schedule Modal State
  const [scheduleTargetPost, setScheduleTargetPost] = useState(null);

  useEffect(() => {
    if (userProfile?.posts) {
      setPosts(userProfile.posts);
    }
  }, [userProfile]);

  const handleDeletePost = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await postsApi.deletePost(deleteTargetId);
      setPosts((prev) => prev.filter((p) => p._id !== deleteTargetId));
      success('Article deleted successfully');
      await refreshProfile();
    } catch (err) {
      error(err.message || 'Failed to delete article');
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-xl font-bold text-content tracking-tight">My Articles</h1>
          <p className="text-xs text-content-secondary mt-0.5">
            Manage, edit, schedule, or view your published writings.
          </p>
        </div>

        <Link
          to="/dashboard/create"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-content text-white hover:bg-neutral-800 transition-colors shadow-subtle"
        >
          <PenSquare className="w-3.5 h-3.5" /> Write Article
        </Link>
      </div>

      {/* Articles Table / List */}
      {posts.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-xl bg-canvas-subtle">
          <BookOpen className="w-10 h-10 text-content-muted mx-auto mb-3" />
          <h3 className="text-base font-semibold text-content">You haven't written any articles yet</h3>
          <p className="text-xs text-content-secondary max-w-sm mx-auto mt-1 mb-5">
            Start crafting insightful tech essays, architecture reviews, and engineering tutorials.
          </p>
          <Link
            to="/dashboard/create"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-content text-white hover:bg-neutral-800 transition-colors shadow-subtle"
          >
            <PenSquare className="w-3.5 h-3.5" /> Create Your First Article
          </Link>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden shadow-subtle bg-white">
          <div className="divide-y divide-border">
            {posts.map((post) => {
              const isScheduled =
                post.scheduledPublished && new Date(post.scheduledPublished) > new Date();

              return (
                <div
                  key={post._id}
                  className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-canvas-subtle transition-colors"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-content hover:text-brand-600">
                        <Link to={`/blogs/${post._id}`}>{post.title}</Link>
                      </h3>
                      {isScheduled ? (
                        <Badge variant="warning" size="xs">
                          Scheduled for {new Date(post.scheduledPublished).toLocaleDateString()}
                        </Badge>
                      ) : (
                        <Badge variant="success" size="xs">
                          Published
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-content-muted flex-wrap">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        {post.claps || 0} claps
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        {post.likes?.length || 0} likes
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {post.comments?.length || 0} comments
                      </span>
                      <span>
                        Created:{' '}
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setScheduleTargetPost(post)}
                      className="p-1.5 rounded-lg border border-border text-content-secondary hover:text-content hover:bg-white transition-colors"
                      title="Schedule article"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                    <Link
                      to={`/dashboard/edit/${post._id}`}
                      className="p-1.5 rounded-lg border border-border text-content-secondary hover:text-content hover:bg-white transition-colors"
                      title="Edit article"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/blogs/${post._id}`}
                      className="p-1.5 rounded-lg border border-border text-content-secondary hover:text-content hover:bg-white transition-colors"
                      title="View public page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setDeleteTargetId(post._id)}
                      className="p-1.5 rounded-lg border border-border text-content-secondary hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Article"
        message="Are you sure you want to permanently delete this article? This action cannot be reversed."
        confirmText="Delete Article"
        isLoading={isDeleting}
        onConfirm={handleDeletePost}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={Boolean(scheduleTargetPost)}
        post={scheduleTargetPost}
        onClose={() => setScheduleTargetPost(null)}
        onScheduled={refreshProfile}
      />
    </div>
  );
};

export default MyBlogsPage;


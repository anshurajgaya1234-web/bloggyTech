import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { commentsApi } from '../../api/comments';
import Avatar from '../common/Avatar';
import ConfirmModal from '../common/ConfirmModal';
import { Link } from 'react-router-dom';
import { MessageSquare, Send, Edit2, Trash2, Check, X } from 'lucide-react';

export const CommentSection = ({ postId, initialComments = [], onCommentAdded }) => {
  const { user, isAuthenticated } = useAuth();
  const { success, error, info } = useToast();

  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit State
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editMessage, setEditMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Delete Confirm State
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!isAuthenticated) {
      info('Please sign in to leave a comment');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await commentsApi.createComment(postId, newComment.trim());
      if (res?.comment) {
        // augment with current user details for immediate display
        const enrichedComment = {
          ...res.comment,
          author: {
            _id: user._id,
            username: user.username,
            profilePicture: user.profilePicture,
          },
        };
        setComments((prev) => [enrichedComment, ...prev]);
        setNewComment('');
        success('Comment posted successfully');
        if (onCommentAdded) onCommentAdded();
      }
    } catch (err) {
      error(err.message || 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditMessage(comment.message);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditMessage('');
  };

  const handleSaveEdit = async (commentId) => {
    if (!editMessage.trim()) return;
    setIsEditing(true);
    try {
      await commentsApi.updateComment(commentId, editMessage.trim());
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, message: editMessage.trim() } : c))
      );
      setEditingCommentId(null);
      setEditMessage('');
      success('Comment updated');
    } catch (err) {
      error(err.message || 'Failed to update comment');
    } finally {
      setIsEditing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await commentsApi.deleteComment(deleteTargetId);
      setComments((prev) => prev.filter((c) => c._id !== deleteTargetId));
      success('Comment removed');
    } catch (err) {
      error(err.message || 'Failed to delete comment');
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-content-secondary" />
        <h3 className="text-lg font-semibold text-content">
          Discussion ({comments.length})
        </h3>
      </div>

      {/* Write Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleAddComment} className="mb-8">
          <div className="flex gap-3">
            <Avatar
              src={user?.profilePicture}
              name={user?.username || 'User'}
              size="sm"
            />
            <div className="flex-1">
              <textarea
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="What are your thoughts on this article?"
                className="w-full p-3 text-sm bg-canvas-subtle border border-border rounded-xl placeholder-content-muted focus:outline-none focus:border-brand-600 focus:bg-white transition-all resize-none shadow-2xs"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-content text-white hover:bg-neutral-800 disabled:opacity-50 transition-colors shadow-subtle"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Posting...' : 'Respond'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-4 mb-8 rounded-xl bg-canvas-subtle border border-border text-center text-sm text-content-secondary">
          <Link to="/login" className="font-semibold text-brand-600 hover:underline">
            Sign in
          </Link>{' '}
          or{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:underline">
            create an account
          </Link>{' '}
          to join the conversation.
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <p className="text-center py-8 text-sm text-content-muted">
          No comments yet. Be the first to share your perspective!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const author = comment.author || {};
            const authorName = typeof author === 'object' ? author.username : 'User';
            const authorId = typeof author === 'object' ? author._id : author;
            const isAuthor = user && user._id === authorId;

            return (
              <div
                key={comment._id}
                className="p-4 rounded-xl border border-border bg-white shadow-subtle hover:border-border-dark transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      src={author.profilePicture}
                      name={authorName}
                      size="xs"
                    />
                    <div>
                      <span className="text-xs font-semibold text-content block">
                        {authorName}
                      </span>
                      <span className="text-[10px] text-content-muted">
                        {comment.createdAt
                          ? new Date(comment.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Recent'}
                      </span>
                    </div>
                  </div>

                  {isAuthor && editingCommentId !== comment._id && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEdit(comment)}
                        className="p-1 text-content-muted hover:text-content rounded hover:bg-canvas-subtle transition-colors"
                        title="Edit comment"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(comment._id)}
                        className="p-1 text-content-muted hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                        title="Delete comment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {editingCommentId === comment._id ? (
                  <div className="mt-2 space-y-2">
                    <textarea
                      rows={2}
                      value={editMessage}
                      onChange={(e) => setEditMessage(e.target.value)}
                      className="w-full p-2.5 text-xs bg-canvas-subtle border border-border rounded-lg focus:outline-none focus:border-brand-600 focus:bg-white resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleCancelEdit}
                        disabled={isEditing}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border border-border hover:bg-canvas-subtle"
                      >
                        <X className="w-3 h-3" /> Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(comment._id)}
                        disabled={isEditing || !editMessage.trim()}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded bg-content text-white hover:bg-neutral-800 disabled:opacity-50"
                      >
                        <Check className="w-3 h-3" /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-content-secondary leading-relaxed pl-8">
                    {comment.message}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be reversed."
        confirmText="Delete"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </section>
  );
};

export default CommentSection;


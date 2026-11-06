import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsApi } from '../../api/posts';
import { categoriesApi } from '../../api/categories';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';

export const EditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const { success, error } = useToast();

  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [content, setContent] = useState('');
  const [currentImage, setCurrentImage] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const [catRes, postRes] = await Promise.all([
          categoriesApi.getAllCategories(),
          postsApi.getPost(id),
        ]);

        setCategories(catRes?.allCategories || []);

        const post = postRes?.post;
        if (post) {
          setTitle(post.title || '');
          const catId = typeof post.category === 'object' ? post.category?._id : post.category;
          setCategoryId(catId || '');
          setContent(post.content || '');
          setCurrentImage(post.image || '');
        } else {
          setFetchError('Article not found.');
        }
      } catch (err) {
        setFetchError(err.message || 'Failed to fetch article details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Article title cannot be blank.');
      return;
    }
    if (!content.trim()) {
      setFormError('Article content cannot be blank.');
      return;
    }

    setIsSubmitting(true);
    try {
      await postsApi.updatePost(id, {
        title: title.trim(),
        category: categoryId,
        content: content.trim(),
      });
      success('Article updated successfully!');
      await refreshProfile();
      navigate('/dashboard/my-blogs');
    } catch (err) {
      setFormError(err.message || 'Failed to update article');
      error(err.message || 'Error updating article');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-16">
        <LoadingSpinner text="Loading article editor..." />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="py-10">
        <ErrorState
          title="Could Not Load Editor"
          message={fetchError}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-border">
        <div>
          <button
            onClick={() => navigate('/dashboard/my-blogs')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-content-secondary hover:text-content mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Articles
          </button>
          <h1 className="text-xl font-bold text-content tracking-tight">Edit Article</h1>
        </div>
      </div>

      {formError && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-content block">Article Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 text-sm font-medium bg-canvas-subtle border border-border rounded-xl placeholder-content-muted focus:outline-none focus:border-brand-600 focus:bg-white transition-all shadow-2xs"
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-content block">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs bg-canvas-subtle border border-border rounded-lg text-content focus:outline-none focus:border-brand-600 focus:bg-white"
            required
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Cover Preview (Read Only) */}
        {currentImage && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-content block">Current Cover Image</label>
            <div className="rounded-xl overflow-hidden border border-border aspect-[16/8] max-w-md bg-canvas-surface">
              <img src={currentImage} alt={title} className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-content block">Content</label>
          <textarea
            rows={14}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 text-sm leading-relaxed bg-canvas-subtle border border-border rounded-xl placeholder-content-muted focus:outline-none focus:border-brand-600 focus:bg-white transition-all shadow-2xs resize-y"
            required
          />
        </div>

        {/* Save Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => navigate('/dashboard/my-blogs')}
            className="px-4 py-2 text-xs font-medium rounded-lg border border-border text-content hover:bg-canvas-subtle"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-content text-white hover:bg-neutral-800 transition-colors shadow-subtle disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlogPage;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsApi } from '../../api/posts';
import { categoriesApi } from '../../api/categories';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  PenSquare,
  Image as ImageIcon,
  FolderPlus,
  Calendar,
  AlertCircle,
  Eye,
  Edit3,
  X,
  UploadCloud,
} from 'lucide-react';

export const CreateBlogPage = () => {
  const { userProfile, refreshProfile } = useAuth();
  const { success, error, warning } = useToast();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  // Scheduling
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDateTime, setScheduleDateTime] = useState('');

  // Tab State: 'write' | 'preview'
  const [activeTab, setActiveTab] = useState('write');

  // New Category inline modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoriesApi.getAllCategories();
        const cats = res?.allCategories || [];
        setCategories(cats);
        if (cats.length > 0 && !categoryId) {
          setCategoryId(cats[0]._id);
        }
      } catch (err) {
        console.warn('Failed to load categories:', err);
      }
    };
    fetchCats();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFormError('Please select a valid image file (PNG, JPG, JPEG).');
        return;
      }
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      setFormError('');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
  };

  const handleCreateNewCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsCreatingCategory(true);
    try {
      const res = await categoriesApi.createCategory(newCategoryName.trim());
      if (res?.category) {
        setCategories((prev) => [...prev, res.category]);
        setCategoryId(res.category._id);
        setNewCategoryName('');
        setIsCategoryModalOpen(false);
        success(`Category "${res.category.name}" created!`);
      }
    } catch (err) {
      error(err.message || 'Failed to create category');
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Please provide an article title.');
      return;
    }
    if (!categoryId) {
      setFormError('Please select a category for this article.');
      return;
    }
    if (!selectedFile) {
      setFormError('Please select a cover image for your article.');
      return;
    }
    if (!content.trim()) {
      setFormError('Please write your article content.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('categoryId', categoryId);
      formData.append('content', content.trim());
      formData.append('file', selectedFile);

      const res = await postsApi.createPost(formData);
      const createdPost = res?.post;

      // If scheduled publication is checked, apply schedule immediately
      if (isScheduled && scheduleDateTime && createdPost?._id) {
        try {
          await postsApi.schedulePost(createdPost._id, new Date(scheduleDateTime).toISOString());
        } catch (scheduleErr) {
          warning('Post created, but setting schedule failed: ' + scheduleErr.message);
        }
      }

      success('Article successfully published!');
      await refreshProfile();
      navigate('/dashboard/my-blogs');
    } catch (err) {
      setFormError(err.message || 'Failed to create article. Please check input fields.');
      error(err.message || 'Error publishing post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-border">
        <div>
          <h1 className="text-xl font-bold text-content tracking-tight">Create New Article</h1>
          <p className="text-xs text-content-secondary mt-0.5">
            Craft a technical publication with distraction-free layout.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center border border-border rounded-lg p-0.5 bg-canvas-subtle">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'write' ? 'bg-white text-content shadow-2xs' : 'text-content-secondary hover:text-content'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'preview' ? 'bg-white text-content shadow-2xs' : 'text-content-secondary hover:text-content'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
        </div>
      </div>

      {formError && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      {activeTab === 'write' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-content block">Article Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Consensus in Cloud-Native Architectures"
              className="w-full px-4 py-3 text-sm font-medium bg-canvas-subtle border border-border rounded-xl placeholder-content-muted focus:outline-none focus:border-brand-600 focus:bg-white transition-all shadow-2xs"
              required
            />
          </div>

          {/* Category Selector with Quick Add */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-content">Category</label>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-600 hover:text-brand-700"
              >
                <FolderPlus className="w-3.5 h-3.5" /> Add New Category
              </button>
            </div>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-canvas-subtle border border-border rounded-lg text-content focus:outline-none focus:border-brand-600 focus:bg-white"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-content block">Cover Image</label>
            {filePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-border aspect-[16/8] bg-canvas-surface group">
                <img src={filePreview} alt="Cover Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl hover:border-brand-500 hover:bg-brand-50/20 cursor-pointer transition-all bg-canvas-subtle">
                <UploadCloud className="w-8 h-8 text-content-muted mb-2" />
                <span className="text-xs font-semibold text-content">Click to upload cover image</span>
                <span className="text-[11px] text-content-muted mt-0.5">PNG, JPG, or WEBP (Max 5MB)</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Content Body */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-content block">
              Content (supports multiple paragraphs)
            </label>
            <textarea
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article here... Detail your engineering perspective, architectural diagrams, trade-offs, and implementation details."
              className="w-full p-4 text-sm leading-relaxed bg-canvas-subtle border border-border rounded-xl placeholder-content-muted focus:outline-none focus:border-brand-600 focus:bg-white transition-all shadow-2xs resize-y"
              required
            />
          </div>

          {/* Scheduling Checkbox */}
          <div className="p-4 rounded-xl border border-border bg-canvas-subtle space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isScheduled}
                onChange={(e) => setIsScheduled(e.target.checked)}
                className="w-4 h-4 rounded border-border text-brand-600 focus:ring-brand-500"
              />
              <span className="text-xs font-semibold text-content flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-600" />
                Schedule for future publication
              </span>
            </label>

            {isScheduled && (
              <div className="pt-2">
                <input
                  type="datetime-local"
                  value={scheduleDateTime}
                  onChange={(e) => setScheduleDateTime(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="px-3 py-2 text-xs bg-white border border-border rounded-lg text-content focus:outline-none focus:border-brand-600"
                />
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => navigate('/dashboard/my-blogs')}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-border text-content hover:bg-canvas-subtle transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-content text-white hover:bg-neutral-800 transition-colors shadow-subtle disabled:opacity-50 flex items-center gap-2"
            >
              <PenSquare className="w-3.5 h-3.5" />
              {isSubmitting ? 'Publishing...' : isScheduled ? 'Schedule Article' : 'Publish Article'}
            </button>
          </div>
        </form>
      ) : (
        /* Preview Tab */
        <div className="space-y-6 max-w-2xl mx-auto py-4">
          <h1 className="text-3xl font-bold text-content leading-tight">
            {title || 'Untitled Article'}
          </h1>
          {filePreview && (
            <div className="rounded-xl overflow-hidden border border-border aspect-[16/9] bg-canvas-surface">
              <img src={filePreview} alt="Cover Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="space-y-4 text-content text-sm sm:text-base leading-relaxed">
            {content ? (
              content.split('\n\n').map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p className="text-content-muted italic">No content written yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Quick Add Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-border shadow-elevated max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-content">Create New Category</h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-content-muted hover:text-content"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateNewCategory} className="space-y-3">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Distributed Systems"
                className="w-full px-3 py-2 text-xs bg-canvas-subtle border border-border rounded-lg placeholder-content-muted focus:outline-none focus:border-brand-600 focus:bg-white"
                autoFocus
                required
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingCategory || !newCategoryName.trim()}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-content text-white hover:bg-neutral-800 disabled:opacity-50"
                >
                  {isCreatingCategory ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBlogPage;


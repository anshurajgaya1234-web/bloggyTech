import React, { useState, useEffect } from 'react';
import { categoriesApi } from '../../api/categories';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/common/ConfirmModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FolderTree, Plus, Edit2, Trash2, X, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CategoriesPage = () => {
  const { success, error } = useToast();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Edit Modal
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Modal
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await categoriesApi.getAllCategories();
      setCategories(res?.allCategories || []);
    } catch (err) {
      error(err.message || 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setIsCreating(true);
    try {
      await categoriesApi.createCategory(newCatName.trim());
      success(`Category "${newCatName.trim()}" created!`);
      setNewCatName('');
      setIsCreateOpen(false);
      await fetchCategories();
    } catch (err) {
      error(err.message || 'Failed to create category');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory || !editName.trim()) return;

    setIsUpdating(true);
    try {
      await categoriesApi.updateCategory(editingCategory._id, editName.trim());
      success('Category updated successfully!');
      setEditingCategory(null);
      setEditName('');
      await fetchCategories();
    } catch (err) {
      error(err.message || 'Failed to update category');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteTargetId) return;

    setIsDeleting(true);
    try {
      await categoriesApi.deleteCategory(deleteTargetId);
      success('Category deleted successfully');
      setCategories((prev) => prev.filter((c) => c._id !== deleteTargetId));
    } catch (err) {
      error(err.message || 'Failed to delete category');
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
          <h1 className="text-xl font-bold text-content tracking-tight">Manage Categories</h1>
          <p className="text-xs text-content-secondary mt-0.5">
            Organize the architectural taxonomy and technical themes for articles.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-content text-white hover:bg-neutral-800 transition-colors shadow-subtle"
        >
          <Plus className="w-3.5 h-3.5" /> Add Category
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading categories..." />
      ) : categories.length === 0 ? (
        <div className="p-10 text-center border border-dashed border-border rounded-xl bg-canvas-subtle">
          <FolderTree className="w-8 h-8 text-content-muted mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-content">No categories defined yet</h3>
          <p className="text-xs text-content-secondary max-w-sm mx-auto mt-1 mb-4">
            Categories help readers discover articles focused on specific domains.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-content text-white hover:bg-neutral-800 transition-colors shadow-subtle"
          >
            <Plus className="w-3.5 h-3.5" /> Create First Category
          </button>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden shadow-subtle bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas-subtle border-b border-border text-content-secondary font-medium">
              <tr>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4 hidden sm:table-cell">Articles</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((cat) => {
                const count = Array.isArray(cat.posts) ? cat.posts.length : 0;
                return (
                  <tr key={cat._id} className="hover:bg-canvas-subtle transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-content">
                      <Link to={`/category/${cat._id}`} className="hover:text-brand-600">
                        {cat.name}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-content-secondary hidden sm:table-cell">
                      <span className="inline-flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {count} {count === 1 ? 'article' : 'articles'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingCategory(cat);
                            setEditName(cat.name);
                          }}
                          className="p-1.5 rounded-lg border border-border text-content-secondary hover:text-content hover:bg-white transition-colors"
                          title="Rename category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(cat._id)}
                          className="p-1.5 rounded-lg border border-border text-content-secondary hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-border shadow-elevated max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-content">Create New Category</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-content-muted hover:text-content"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateCategory} className="space-y-3">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Category name (e.g. Microservices)"
                className="w-full px-3 py-2 text-xs bg-canvas-subtle border border-border rounded-lg focus:outline-none focus:border-brand-600 focus:bg-white"
                autoFocus
                required
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newCatName.trim()}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-content text-white hover:bg-neutral-800 disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-border shadow-elevated max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-content">Rename Category</h3>
              <button
                onClick={() => setEditingCategory(null)}
                className="text-content-muted hover:text-content"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUpdateCategory} className="space-y-3">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-canvas-subtle border border-border rounded-lg focus:outline-none focus:border-brand-600 focus:bg-white"
                autoFocus
                required
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating || !editName.trim()}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-content text-white hover:bg-neutral-800 disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Category"
        message="Are you sure you want to remove this category? Articles in this category will remain, but the category reference will be removed."
        confirmText="Delete Category"
        isLoading={isDeleting}
        onConfirm={handleDeleteCategory}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};

export default CategoriesPage;


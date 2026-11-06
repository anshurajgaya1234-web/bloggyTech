import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriesApi } from '../../api/categories';
import { FolderTree, BookOpen, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const CategoriesExplorePage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const res = await categoriesApi.getAllCategories();
        setCategories(res?.allCategories || []);
      } catch (err) {
        console.warn('Failed to load categories:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-border pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-content tracking-tight">
          Explore Categories
        </h1>
        <p className="text-sm text-content-secondary max-w-2xl">
          Discover specialized technical topics, architecture guides, and engineering paradigms.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading topics..." />
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-sm text-content-muted">
          No categories have been established yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const count = Array.isArray(cat.posts) ? cat.posts.length : 0;
            return (
              <Link
                key={cat._id}
                to={`/category/${cat._id}`}
                className="group flex flex-col justify-between p-6 bg-white border border-border rounded-xl shadow-subtle hover:shadow-card hover:border-brand-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-canvas-subtle border border-border flex items-center justify-center text-brand-600 group-hover:bg-brand-50 transition-colors">
                    <FolderTree className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-content group-hover:text-brand-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-content-secondary line-clamp-2">
                    Explore insights, tutorials, and discussions related to {cat.name}.
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-border-subtle flex items-center justify-between text-xs text-content-muted group-hover:text-content">
                  <span className="flex items-center gap-1.5 font-medium">
                    <BookOpen className="w-3.5 h-3.5" />
                    {count} {count === 1 ? 'article' : 'articles'}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-brand-600">
                    View <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoriesExplorePage;


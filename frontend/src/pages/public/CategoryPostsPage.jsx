import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categoriesApi } from '../../api/categories';
import BlogGrid from '../../components/blog/BlogGrid';
import { ArrowLeft, FolderTree } from 'lucide-react';

export const CategoryPostsPage = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      setIsLoading(true);
      try {
        const res = await categoriesApi.getAllCategories();
        const allCats = res?.allCategories || [];
        const currentCat = allCats.find((c) => c._id === categoryId);
        if (currentCat) {
          setCategory(currentCat);
          // each category has populated posts
          const enriched = (currentCat.posts || []).map((p) => ({
            ...p,
            category: { _id: currentCat._id, name: currentCat.name },
          }));
          setPosts(enriched);
        }
      } catch (err) {
        console.warn('Failed to load category posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryPosts();
  }, [categoryId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3 border-b border-border pb-6">
        <Link
          to="/categories"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-content-secondary hover:text-content transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> All Categories
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-content tracking-tight">
              {category?.name || 'Category'}
            </h1>
            <p className="text-xs text-content-secondary mt-0.5">
              {posts.length} {posts.length === 1 ? 'article published' : 'articles published'}
            </p>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <BlogGrid
        posts={posts}
        isLoading={isLoading}
        emptyTitle="No articles in this category"
        emptyDescription="There are currently no published articles filed under this category."
        emptyActionLabel="Explore other categories"
        emptyActionLink="/categories"
      />
    </div>
  );
};

export default CategoryPostsPage;


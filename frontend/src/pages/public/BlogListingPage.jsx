import React, { useState, useEffect, useMemo } from 'react';
import { postsApi } from '../../api/posts';
import { categoriesApi } from '../../api/categories';
import { useAuth } from '../../context/AuthContext';
import BlogGrid from '../../components/blog/BlogGrid';
import { Search, Filter, SlidersHorizontal, BookOpen } from 'lucide-react';

export const BlogListingPage = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'claps' | 'likes'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const catRes = await categoriesApi.getAllCategories();
        const cats = catRes?.allCategories || [];
        setCategories(cats);

        if (isAuthenticated) {
          try {
            const postRes = await postsApi.getAllPosts();
            setPosts(postRes?.allPosts || []);
          } catch {
            extractPosts(cats);
          }
        } else {
          extractPosts(cats);
        }
      } catch (err) {
        console.warn('Error loading posts archive:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const extractPosts = (cats) => {
      const allExtracted = [];
      const seenIds = new Set();
      cats.forEach((cat) => {
        if (Array.isArray(cat.posts)) {
          cat.posts.forEach((p) => {
            if (p && p._id && !seenIds.has(p._id)) {
              seenIds.add(p._id);
              allExtracted.push({
                ...p,
                category: { _id: cat._id, name: cat.name },
              });
            }
          });
        }
      });
      setPosts(allExtracted);
    };

    fetchData();
  }, [isAuthenticated]);

  // Filter & Sort Logic
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => {
        const catId = typeof p.category === 'object' ? p.category?._id : p.category;
        return catId === selectedCategory;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.content?.toLowerCase().includes(q) ||
          p.author?.username?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'claps') {
      result.sort((a, b) => (b.claps || 0) - (a.claps || 0));
    } else if (sortBy === 'likes') {
      result.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    }

    return result;
  }, [posts, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-border pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-content tracking-tight">
          Articles & Publications
        </h1>
        <p className="text-sm text-content-secondary max-w-2xl">
          Browse our complete library of technology essays, architectural patterns, and engineering insights.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-border shadow-subtle">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-content-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by title, keywords, author..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-canvas-subtle border border-border rounded-lg placeholder-content-muted focus:outline-none focus:border-brand-600 focus:bg-white transition-all"
          />
        </div>

        {/* Category & Sort Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-content-secondary hidden sm:inline">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs bg-canvas-subtle border border-border rounded-lg text-content focus:outline-none focus:border-brand-600 focus:bg-white"
            >
              <option value="all">All Topics</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-content-secondary hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-xs bg-canvas-subtle border border-border rounded-lg text-content focus:outline-none focus:border-brand-600 focus:bg-white"
            >
              <option value="newest">Latest First</option>
              <option value="claps">Most Clapped</option>
              <option value="likes">Most Liked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-content-secondary font-medium">
        Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
      </div>

      {/* Grid */}
      <BlogGrid
        posts={filteredPosts}
        isLoading={isLoading}
        emptyTitle="No matching articles found"
        emptyDescription="Try adjusting your search criteria or topic filters."
      />
    </div>
  );
};

export default BlogListingPage;


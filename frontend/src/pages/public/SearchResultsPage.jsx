import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { postsApi } from '../../api/posts';
import { categoriesApi } from '../../api/categories';
import { useAuth } from '../../context/AuthContext';
import BlogGrid from '../../components/blog/BlogGrid';
import { Search, ArrowLeft } from 'lucide-react';

export const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { isAuthenticated } = useAuth();

  const [inputVal, setInputVal] = useState(query);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setInputVal(query);
  }, [query]);

  useEffect(() => {
    const fetchAndFilter = async () => {
      setIsLoading(true);
      try {
        let all = [];
        if (isAuthenticated) {
          try {
            const res = await postsApi.getAllPosts();
            all = res?.allPosts || [];
          } catch {
            const catRes = await categoriesApi.getAllCategories();
            all = extractPosts(catRes?.allCategories || []);
          }
        } else {
          const catRes = await categoriesApi.getAllCategories();
          all = extractPosts(catRes?.allCategories || []);
        }

        if (query.trim()) {
          const q = query.toLowerCase();
          all = all.filter(
            (p) =>
              p.title?.toLowerCase().includes(q) ||
              p.content?.toLowerCase().includes(q) ||
              p.author?.username?.toLowerCase().includes(q)
          );
        }
        setPosts(all);
      } catch (err) {
        console.warn('Search query error:', err);
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
      return allExtracted;
    };

    fetchAndFilter();
  }, [query, isAuthenticated]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchParams({ q: inputVal.trim() });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header */}
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-content tracking-tight">
          Search Articles
        </h1>
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-content-muted" />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Search keywords, titles, or concepts..."
            className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-border rounded-xl placeholder-content-muted focus:outline-none focus:border-brand-600 shadow-subtle"
          />
        </form>
        {query && (
          <p className="text-xs text-content-secondary">
            Showing results for <strong className="text-content">"{query}"</strong> ({posts.length} found)
          </p>
        )}
      </div>

      {/* Results */}
      <BlogGrid
        posts={posts}
        isLoading={isLoading}
        emptyTitle="No matches found"
        emptyDescription={`We couldn't find any articles matching "${query}". Try searching for alternative keywords.`}
      />
    </div>
  );
};

export default SearchResultsPage;


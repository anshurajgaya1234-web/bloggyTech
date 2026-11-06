import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsApi } from '../../api/posts';
import { categoriesApi } from '../../api/categories';
import { useAuth } from '../../context/AuthContext';
import BlogGrid from '../../components/blog/BlogGrid';
import Badge from '../../components/common/Badge';
import {
  ArrowRight,
  TrendingUp,
  Sparkles,
  BookOpen,
  Feather,
  Layers,
  Compass,
} from 'lucide-react';

export const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories (public)
        const catRes = await categoriesApi.getAllCategories();
        const cats = catRes?.allCategories || [];
        setCategories(cats);

        // Fetch posts
        // Note: GET /api/v1/posts requires auth in backend. If not logged in, we can extract posts from populated categories!
        if (isAuthenticated) {
          try {
            const postRes = await postsApi.getAllPosts();
            setPosts(postRes?.allPosts || []);
          } catch {
            // Fallback to extracting posts from categories
            extractPostsFromCategories(cats);
          }
        } else {
          extractPostsFromCategories(cats);
        }
      } catch (err) {
        console.warn('Error loading home data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const extractPostsFromCategories = (cats) => {
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

  // Filter posts by category
  const filteredPosts =
    selectedCategory === 'all'
      ? posts
      : posts.filter((p) => {
          const catId = typeof p.category === 'object' ? p.category?._id : p.category;
          return catId === selectedCategory;
        });

  // Featured post is the most clapped or latest
  const featuredPost = posts.length > 0 ? posts[0] : null;

  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-border rounded-2xl p-8 sm:p-14 bg-gradient-to-b from-canvas-subtle to-white relative overflow-hidden shadow-subtle">
          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modern Engineering & Architecture Insights</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-content leading-tight">
              Where technical craft meets deep perspective.
            </h1>

            <p className="text-base sm:text-lg text-content-secondary leading-relaxed font-normal max-w-2xl">
              BlogiTech is an intentional publishing platform built for engineers, system designers, and technology leaders. Read high-signal essays, explore architecture patterns, and publish with focus.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-content text-white font-medium text-sm hover:bg-neutral-800 transition-colors shadow-subtle"
              >
                <span>Explore Articles</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={isAuthenticated ? '/dashboard/create' : '/register'}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-white text-content font-medium text-sm hover:bg-canvas-subtle transition-colors shadow-subtle"
              >
                <Feather className="w-4 h-4 text-brand-600" />
                <span>Start Writing</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Bar */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 pb-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors flex-shrink-0 border ${
                selectedCategory === 'all'
                  ? 'bg-content text-white border-content'
                  : 'bg-white border-border text-content-secondary hover:text-content hover:bg-canvas-subtle'
              }`}
            >
              All Topics
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors flex-shrink-0 border ${
                  selectedCategory === cat._id
                    ? 'bg-content text-white border-content'
                    : 'bg-white border-border text-content-secondary hover:text-content hover:bg-canvas-subtle'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Featured / Lead Article Banner (if available) */}
      {featuredPost && selectedCategory === 'all' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-brand-600" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-content-secondary">
              Featured Insight
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-border rounded-xl p-6 sm:p-8 shadow-subtle hover:border-border-dark transition-all">
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <Badge variant="brand" size="xs">
                  {typeof featuredPost.category === 'object'
                    ? featuredPost.category.name
                    : 'Engineering'}
                </Badge>
                <h3 className="text-xl sm:text-2xl font-bold text-content hover:text-brand-600 transition-colors">
                  <Link to={`/blogs/${featuredPost._id}`}>{featuredPost.title}</Link>
                </h3>
                <p className="text-sm text-content-secondary line-clamp-3 leading-relaxed">
                  {featuredPost.content?.replace(/[#*`_>\[\]]/g, '').slice(0, 220)}...
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
                <div className="text-xs text-content-muted">
                  By{' '}
                  <span className="font-medium text-content">
                    {featuredPost.author?.username || 'Author'}
                  </span>
                </div>
                <Link
                  to={`/blogs/${featuredPost._id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  Read full story <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 aspect-[16/10] rounded-lg overflow-hidden bg-canvas-surface border border-border">
              {featuredPost.image ? (
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-content-muted">
                  Cover preview
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Main Articles Stream */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-content">Latest Publications</h2>
            <p className="text-xs text-content-secondary">
              Carefully curated writings from our community of authors
            </p>
          </div>
          <Link
            to="/blogs"
            className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            Browse all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <BlogGrid
          posts={filteredPosts}
          isLoading={isLoading}
          emptyTitle="No articles available"
          emptyDescription="Be the first engineer to publish an insight on this topic!"
          emptyActionLabel={isAuthenticated ? 'Write First Article' : 'Sign In to Publish'}
          emptyActionLink={isAuthenticated ? '/dashboard/create' : '/login'}
        />
      </section>
    </div>
  );
};

export default HomePage;


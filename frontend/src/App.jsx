import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts & Route Guards
import AppLayout from './components/layout/AppLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/routing/ProtectedRoute';
import GuestRoute from './components/routing/GuestRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import BlogListingPage from './pages/public/BlogListingPage';
import BlogDetailPage from './pages/public/BlogDetailPage';
import CategoryPostsPage from './pages/public/CategoryPostsPage';
import CategoriesExplorePage from './pages/public/CategoriesExplorePage';
import SearchResultsPage from './pages/public/SearchResultsPage';
import AuthorProfilePage from './pages/public/AuthorProfilePage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Dashboard Pages
import DashboardOverviewPage from './pages/dashboard/DashboardOverviewPage';
import MyBlogsPage from './pages/dashboard/MyBlogsPage';
import CreateBlogPage from './pages/dashboard/CreateBlogPage';
import EditBlogPage from './pages/dashboard/EditBlogPage';
import CategoriesPage from './pages/dashboard/CategoriesPage';
import MyProfilePage from './pages/dashboard/MyProfilePage';

// 404 Fallback Page
const NotFoundPage = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
    <div className="w-12 h-12 rounded-xl bg-canvas-surface border border-border flex items-center justify-center text-content-secondary font-bold text-lg mb-4">
      404
    </div>
    <h1 className="text-xl font-bold text-content mb-1">Page Not Found</h1>
    <p className="text-xs text-content-secondary max-w-sm mb-6 leading-relaxed">
      The page you are looking for does not exist or has been moved.
    </p>
    <Link
      to="/"
      className="px-4 py-2 text-xs font-semibold rounded-lg bg-content text-white hover:bg-neutral-800 transition-colors shadow-subtle"
    >
      Return to Homepage
    </Link>
  </div>
);

export const App = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public App Layout */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/blogs" element={<BlogListingPage />} />
              <Route path="/blogs/:id" element={<BlogDetailPage />} />
              <Route path="/category/:categoryId" element={<CategoryPostsPage />} />
              <Route path="/categories" element={<CategoriesExplorePage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/author/:authorId" element={<AuthorProfilePage />} />

              {/* Public reset route */}
              <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />

              {/* Guest Only Routes (wrapped in AppLayout) */}
              <Route
                path="/login"
                element={
                  <GuestRoute>
                    <LoginPage />
                  </GuestRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <GuestRoute>
                    <RegisterPage />
                  </GuestRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <GuestRoute>
                    <ForgotPasswordPage />
                  </GuestRoute>
                }
              />

              {/* 404 Not Found inside AppLayout */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Protected Creator Dashboard Layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardOverviewPage />} />
              <Route path="my-blogs" element={<MyBlogsPage />} />
              <Route path="create" element={<CreateBlogPage />} />
              <Route path="edit/:id" element={<EditBlogPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="profile" element={<MyProfilePage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;

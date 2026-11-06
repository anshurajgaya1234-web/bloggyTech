import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authApi } from '../../api/auth';
import Badge from '../../components/common/Badge';
import {
  BookOpen,
  Sparkles,
  Users,
  Eye,
  PenSquare,
  FolderTree,
  ExternalLink,
  Edit2,
  Calendar,
  AlertTriangle,
  Mail,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const DashboardOverviewPage = () => {
  const { user, userProfile, refreshProfile } = useAuth();
  const { success, error } = useToast();
  const [isSendingVerify, setIsSendingVerify] = useState(false);

  useEffect(() => {
    refreshProfile();
  }, []);

  const profile = userProfile || user || {};
  const posts = Array.isArray(profile.posts) ? profile.posts : [];
  const followers = Array.isArray(profile.followers) ? profile.followers : [];
  const following = Array.isArray(profile.following) ? profile.following : [];
  const profileViewers = Array.isArray(profile.profileViewers) ? profile.profileViewers : [];

  // Calculate total claps across user's posts
  const totalClaps = posts.reduce((sum, p) => sum + (p.claps || 0), 0);

  const isVerified = Boolean(profile.isVerified);

  const handleSendVerify = async () => {
    setIsSendingVerify(true);
    try {
      const res = await authApi.sendVerificationEmail();
      success(res?.message || 'Verification email sent!');
    } catch (err) {
      error(err.message || 'Failed to send verification email');
    } finally {
      setIsSendingVerify(false);
    }
  };

  const statCards = [
    {
      title: 'Published Articles',
      value: posts.length,
      icon: BookOpen,
      color: 'text-brand-600',
      bg: 'bg-brand-50',
    },
    {
      title: 'Total Claps Received',
      value: totalClaps,
      icon: Sparkles,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Followers',
      value: followers.length,
      icon: Users,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Profile Viewers',
      value: profileViewers.length,
      icon: Eye,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-content tracking-tight">
              Welcome, {profile.username || 'Creator'}
            </h1>
            {isVerified ? (
              <Badge variant="success" size="xs">
                Verified
              </Badge>
            ) : (
              <Badge variant="warning" size="xs">
                Unverified
              </Badge>
            )}
          </div>
          <p className="text-xs text-content-secondary mt-1">
            Overview of your published content, audience reach, and publishing stats.
          </p>
        </div>

        <Link
          to="/dashboard/create"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-content text-white hover:bg-neutral-800 transition-colors shadow-subtle"
        >
          <PenSquare className="w-3.5 h-3.5" /> Write New Article
        </Link>
      </div>

      {/* Account Verification Prompt (if unverified) */}
      {!isVerified && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-amber-900">Verify Your Email Address</h4>
              <p className="text-xs text-amber-750 mt-0.5">
                Verifying your account confirms ownership of your email address and unlocks full community credibility.
              </p>
            </div>
          </div>
          <button
            onClick={handleSendVerify}
            disabled={isSendingVerify}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors shadow-2xs whitespace-nowrap disabled:opacity-50"
          >
            <Mail className="w-3.5 h-3.5" />
            {isSendingVerify ? 'Sending...' : 'Send Verification Email'}
          </button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="p-5 rounded-xl border border-border bg-white shadow-subtle flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <span className="text-xs text-content-secondary font-medium">{stat.title}</span>
                <p className="text-2xl font-bold text-content tracking-tight">{stat.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Articles Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-content">Recent Articles</h2>
          <Link
            to="/dashboard/my-blogs"
            className="text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            View all ({posts.length})
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-xl bg-canvas-subtle">
            <BookOpen className="w-8 h-8 text-content-muted mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-content">No articles published yet</h3>
            <p className="text-xs text-content-secondary max-w-sm mx-auto mt-1 mb-4">
              Share your technical knowledge and ideas with the community.
            </p>
            <Link
              to="/dashboard/create"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-content text-white hover:bg-neutral-800 transition-colors shadow-subtle"
            >
              <PenSquare className="w-3.5 h-3.5" /> Create your first article
            </Link>
          </div>
        ) : (
          <div className="border border-border rounded-xl overflow-hidden shadow-subtle bg-white">
            <div className="divide-y divide-border">
              {posts.slice(0, 5).map((post) => (
                <div
                  key={post._id}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-canvas-subtle transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-content truncate">
                      <Link to={`/blogs/${post._id}`} className="hover:text-brand-600">
                        {post.title}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-content-muted mt-1">
                      <span>{post.claps || 0} claps</span>
                      <span>•</span>
                      <span>{post.likes?.length || 0} likes</span>
                      <span>•</span>
                      <span>
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/dashboard/edit/${post._id}`}
                      className="p-1.5 rounded-lg border border-border text-content-secondary hover:text-content hover:bg-white transition-colors"
                      title="Edit article"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to={`/blogs/${post._id}`}
                      className="p-1.5 rounded-lg border border-border text-content-secondary hover:text-content hover:bg-white transition-colors"
                      title="View public article"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverviewPage;


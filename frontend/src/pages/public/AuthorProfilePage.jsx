import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usersApi } from '../../api/users';
import { postsApi } from '../../api/posts';
import { categoriesApi } from '../../api/categories';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import BlogGrid from '../../components/blog/BlogGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import ConfirmModal from '../../components/common/ConfirmModal';
import {
  UserPlus,
  UserCheck,
  ShieldAlert,
  BookOpen,
  Users,
  Eye,
  ArrowLeft,
  Calendar,
} from 'lucide-react';

export const AuthorProfilePage = () => {
  const { authorId } = useParams();
  const { user, userProfile, isAuthenticated, refreshProfile } = useAuth();
  const { success, error, info } = useToast();

  const [author, setAuthor] = useState(null);
  const [authorPosts, setAuthorPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Social states
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isSocialActionLoading, setIsSocialActionLoading] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  const isSelf = user && user._id === authorId;

  const fetchAuthorData = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      // Record view & check if user exists
      if (isAuthenticated && !isSelf) {
        try {
          await usersApi.viewOtherProfile(authorId);
        } catch {
          // Already viewed or ignore
        }
      }

      // Fetch all posts to find author's posts and author details
      let all = [];
      if (isAuthenticated) {
        try {
          const pRes = await postsApi.getAllPosts();
          all = pRes?.allPosts || [];
        } catch {
          const catRes = await categoriesApi.getAllCategories();
          all = extractPosts(catRes?.allCategories || []);
        }
      } else {
        const catRes = await categoriesApi.getAllCategories();
        all = extractPosts(catRes?.allCategories || []);
      }

      // Filter posts by this author
      const matchingPosts = all.filter((p) => {
        const aId = typeof p.author === 'object' ? p.author?._id : p.author;
        return aId === authorId;
      });
      setAuthorPosts(matchingPosts);

      // Extract author meta from posts or userProfile
      if (isSelf && userProfile) {
        setAuthor(userProfile);
      } else if (matchingPosts.length > 0 && typeof matchingPosts[0].author === 'object') {
        setAuthor(matchingPosts[0].author);
      } else {
        setAuthor({
          _id: authorId,
          username: 'Author',
          role: 'user',
        });
      }

      // Check following/blocked status from current user's profile
      if (userProfile) {
        const follows = userProfile.following?.some((f) =>
          typeof f === 'object' ? f._id === authorId : f === authorId
        );
        setIsFollowing(Boolean(follows));

        const blocked = userProfile.blockedUsers?.some((b) =>
          typeof b === 'object' ? b._id === authorId : b === authorId
        );
        setIsBlocked(Boolean(blocked));
      }
    } catch (err) {
      setFetchError(err.message || 'Failed to load author profile');
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

  useEffect(() => {
    fetchAuthorData();
  }, [authorId, userProfile]);

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      info('Please sign in to follow authors');
      return;
    }
    if (isSelf) return;

    setIsSocialActionLoading(true);
    try {
      if (isFollowing) {
        await usersApi.unfollowUser(authorId);
        setIsFollowing(false);
        info(`Unfollowed ${author?.username || 'author'}`);
      } else {
        await usersApi.followUser(authorId);
        setIsFollowing(true);
        success(`Now following ${author?.username || 'author'}`);
      }
      await refreshProfile();
    } catch (err) {
      error(err.message || 'Action failed');
    } finally {
      setIsSocialActionLoading(false);
    }
  };

  const handleBlockToggle = async () => {
    if (!isAuthenticated) {
      info('Please sign in to manage user blocking');
      return;
    }
    if (isSelf) return;

    setIsSocialActionLoading(true);
    try {
      if (isBlocked) {
        await usersApi.unblockUser(authorId);
        setIsBlocked(false);
        success(`Unblocked ${author?.username || 'author'}`);
      } else {
        await usersApi.blockUser(authorId);
        setIsBlocked(true);
        info(`Blocked ${author?.username || 'author'}`);
      }
      setIsBlockModalOpen(false);
      await refreshProfile();
    } catch (err) {
      error(err.message || 'Action failed');
    } finally {
      setIsSocialActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <LoadingSpinner text="Loading author profile..." />
      </div>
    );
  }

  if (fetchError || !author) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <ErrorState
          title="Author Profile Unavailable"
          message={fetchError || 'Could not load author details.'}
          onRetry={fetchAuthorData}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <div>
        <Link
          to="/blogs"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-content-secondary hover:text-content transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to articles
        </Link>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white border border-border rounded-xl p-6 sm:p-8 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <Avatar
            src={author.profilePicture}
            name={author.username || 'Author'}
            size="xl"
          />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-content tracking-tight">
                {author.username}
              </h1>
              <Badge variant="brand" size="xs">
                {author.role || 'Author'}
              </Badge>
              {author.accountLevel && (
                <Badge variant="neutral" size="xs">
                  {author.accountLevel}
                </Badge>
              )}
            </div>

            <p className="text-xs text-content-secondary max-w-lg leading-relaxed">
              {author.bio || 'Contributing essays and engineering patterns on BlogiTech.'}
            </p>

            {author.location && (
              <p className="text-[11px] text-content-muted">Based in {author.location}</p>
            )}
          </div>
        </div>

        {/* Action Buttons (Follow / Block) */}
        {!isSelf && isAuthenticated && (
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={handleFollowToggle}
              disabled={isSocialActionLoading}
              className={`flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors shadow-subtle ${
                isFollowing
                  ? 'border border-border bg-canvas-subtle text-content hover:bg-canvas-surface'
                  : 'bg-content text-white hover:bg-neutral-800'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Following
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" /> Follow Author
                </>
              )}
            </button>

            <button
              onClick={() => setIsBlockModalOpen(true)}
              disabled={isSocialActionLoading}
              className={`p-2 rounded-lg border text-xs transition-colors ${
                isBlocked
                  ? 'border-red-300 bg-red-50 text-red-600'
                  : 'border-border text-content-muted hover:text-red-600 hover:bg-red-50/50'
              }`}
              title={isBlocked ? 'Unblock user' : 'Block user'}
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Author's Articles Section */}
      <div className="space-y-6">
        <div className="border-b border-border pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600" />
            <h2 className="text-lg font-semibold text-content">
              Articles by {author.username} ({authorPosts.length})
            </h2>
          </div>
        </div>

        <BlogGrid
          posts={authorPosts}
          isLoading={false}
          emptyTitle="No publications yet"
          emptyDescription={`${author.username} hasn't published any articles yet.`}
        />
      </div>

      {/* Block Confirm Modal */}
      <ConfirmModal
        isOpen={isBlockModalOpen}
        title={isBlocked ? `Unblock ${author.username}` : `Block ${author.username}`}
        message={
          isBlocked
            ? `Are you sure you want to unblock ${author.username}? Their articles will once again appear in your feed.`
            : `Are you sure you want to block ${author.username}? You will no longer see articles authored by this user.`
        }
        confirmText={isBlocked ? 'Unblock' : 'Block'}
        isDanger={!isBlocked}
        isLoading={isSocialActionLoading}
        onConfirm={handleBlockToggle}
        onCancel={() => setIsBlockModalOpen(false)}
      />
    </div>
  );
};

export default AuthorProfilePage;


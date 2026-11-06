import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { usersApi } from '../../api/users';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import {
  UserCheck,
  Users,
  ShieldAlert,
  Eye,
  UserX,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyProfilePage = () => {
  const { user, userProfile, refreshProfile } = useAuth();
  const { success, error, info } = useToast();

  const [activeTab, setActiveTab] = useState('following'); // 'following' | 'followers' | 'blocked' | 'viewers'
  const [actionInProgressId, setActionInProgressId] = useState(null);

  useEffect(() => {
    refreshProfile();
  }, []);

  const profile = userProfile || user || {};
  const following = Array.isArray(profile.following) ? profile.following : [];
  const followers = Array.isArray(profile.followers) ? profile.followers : [];
  const blockedUsers = Array.isArray(profile.blockedUsers) ? profile.blockedUsers : [];
  const profileViewers = Array.isArray(profile.profileViewers) ? profile.profileViewers : [];

  const handleUnfollow = async (targetId, targetName) => {
    setActionInProgressId(targetId);
    try {
      await usersApi.unfollowUser(targetId);
      info(`Unfollowed ${targetName || 'user'}`);
      await refreshProfile();
    } catch (err) {
      error(err.message || 'Failed to unfollow');
    } finally {
      setActionInProgressId(null);
    }
  };

  const handleUnblock = async (targetId, targetName) => {
    setActionInProgressId(targetId);
    try {
      await usersApi.unblockUser(targetId);
      success(`Unblocked ${targetName || 'user'}`);
      await refreshProfile();
    } catch (err) {
      error(err.message || 'Failed to unblock');
    } finally {
      setActionInProgressId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Overview Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pb-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Avatar
            src={profile.profilePicture}
            name={profile.username || 'User'}
            size="xl"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-content">{profile.username}</h1>
              <Badge variant="brand" size="xs">
                {profile.role || 'user'}
              </Badge>
              <Badge variant="neutral" size="xs">
                {profile.accountLevel || 'Bronze'}
              </Badge>
            </div>
            <p className="text-xs text-content-secondary">{profile.email}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('following')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'following'
                ? 'border-content text-content'
                : 'border-transparent text-content-secondary hover:text-content'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Following ({following.length})
          </button>

          <button
            onClick={() => setActiveTab('followers')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'followers'
                ? 'border-content text-content'
                : 'border-transparent text-content-secondary hover:text-content'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Followers ({followers.length})
          </button>

          <button
            onClick={() => setActiveTab('viewers')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'viewers'
                ? 'border-content text-content'
                : 'border-transparent text-content-secondary hover:text-content'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Profile Viewers ({profileViewers.length})
          </button>

          <button
            onClick={() => setActiveTab('blocked')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'blocked'
                ? 'border-content text-content'
                : 'border-transparent text-content-secondary hover:text-content'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Blocked Users ({blockedUsers.length})
          </button>
        </div>

        {/* Tab Content: Following */}
        {activeTab === 'following' && (
          <div className="space-y-3">
            {following.length === 0 ? (
              <p className="text-center py-8 text-xs text-content-muted">
                You are not following any authors yet.
              </p>
            ) : (
              <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-white">
                {following.map((target) => {
                  const targetId = typeof target === 'object' ? target._id : target;
                  const targetName = typeof target === 'object' ? target.username : 'User';
                  const targetPic = typeof target === 'object' ? target.profilePicture : null;

                  return (
                    <div
                      key={targetId}
                      className="p-3.5 flex items-center justify-between gap-3 hover:bg-canvas-subtle"
                    >
                      <Link
                        to={`/author/${targetId}`}
                        className="flex items-center gap-2.5 hover:opacity-80"
                      >
                        <Avatar src={targetPic} name={targetName} size="sm" />
                        <span className="text-xs font-semibold text-content">{targetName}</span>
                      </Link>
                      <button
                        onClick={() => handleUnfollow(targetId, targetName)}
                        disabled={actionInProgressId === targetId}
                        className="px-3 py-1 text-xs font-medium rounded-lg border border-border hover:bg-canvas-surface transition-colors"
                      >
                        {actionInProgressId === targetId ? 'Updating...' : 'Unfollow'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Followers */}
        {activeTab === 'followers' && (
          <div className="space-y-3">
            {followers.length === 0 ? (
              <p className="text-center py-8 text-xs text-content-muted">
                You do not have any followers yet.
              </p>
            ) : (
              <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-white">
                {followers.map((follower) => {
                  const fId = typeof follower === 'object' ? follower._id : follower;
                  const fName = typeof follower === 'object' ? follower.username : 'Follower';
                  const fPic = typeof follower === 'object' ? follower.profilePicture : null;

                  return (
                    <div
                      key={fId}
                      className="p-3.5 flex items-center justify-between gap-3 hover:bg-canvas-subtle"
                    >
                      <Link
                        to={`/author/${fId}`}
                        className="flex items-center gap-2.5 hover:opacity-80"
                      >
                        <Avatar src={fPic} name={fName} size="sm" />
                        <span className="text-xs font-semibold text-content">{fName}</span>
                      </Link>
                      <Link
                        to={`/author/${fId}`}
                        className="p-1.5 rounded-lg border border-border text-content-secondary hover:text-content"
                        title="View author profile"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Profile Viewers */}
        {activeTab === 'viewers' && (
          <div className="space-y-3">
            {profileViewers.length === 0 ? (
              <p className="text-center py-8 text-xs text-content-muted">
                No users have viewed your profile yet.
              </p>
            ) : (
              <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-white">
                {profileViewers.map((viewer, idx) => {
                  const vId = typeof viewer === 'object' ? viewer._id : viewer;
                  const vName = typeof viewer === 'object' ? viewer.username : 'Member';
                  const vPic = typeof viewer === 'object' ? viewer.profilePicture : null;

                  return (
                    <div
                      key={vId || idx}
                      className="p-3.5 flex items-center justify-between gap-3 hover:bg-canvas-subtle"
                    >
                      <div className="flex items-center gap-2.5">
                        <Avatar src={vPic} name={vName} size="sm" />
                        <div>
                          <span className="text-xs font-semibold text-content block">{vName}</span>
                          <span className="text-[10px] text-content-muted">Viewed your profile</span>
                        </div>
                      </div>
                      {vId && (
                        <Link
                          to={`/author/${vId}`}
                          className="p-1.5 rounded-lg border border-border text-content-secondary hover:text-content"
                          title="View member profile"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Blocked Users */}
        {activeTab === 'blocked' && (
          <div className="space-y-3">
            {blockedUsers.length === 0 ? (
              <p className="text-center py-8 text-xs text-content-muted">
                Your blocked users list is empty.
              </p>
            ) : (
              <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-white">
                {blockedUsers.map((b) => {
                  const bId = typeof b === 'object' ? b._id : b;
                  const bName = typeof b === 'object' ? b.username : 'Blocked User';

                  return (
                    <div
                      key={bId}
                      className="p-3.5 flex items-center justify-between gap-3 hover:bg-canvas-subtle"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                          <UserX className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold text-content">{bName}</span>
                      </div>
                      <button
                        onClick={() => handleUnblock(bId, bName)}
                        disabled={actionInProgressId === bId}
                        className="px-3 py-1 text-xs font-medium rounded-lg border border-border hover:bg-canvas-surface transition-colors"
                      >
                        {actionInProgressId === bId ? 'Unblocking...' : 'Unblock'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfilePage;

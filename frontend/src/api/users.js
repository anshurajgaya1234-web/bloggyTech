import apiClient from './client';

export const usersApi = {
  // Get current user profile: GET /api/v1/users/profile
  getProfile: async () => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  // View another user profile (registers view): GET /api/v1/users/view-other-profile/:userProfileId
  viewOtherProfile: async (userProfileId) => {
    const response = await apiClient.get(`/users/view-other-profile/${userProfileId}`);
    return response.data;
  },

  // Follow a user: PUT /api/v1/users/following/:userIdToFollow
  followUser: async (userIdToFollow) => {
    const response = await apiClient.put(`/users/following/${userIdToFollow}`);
    return response.data;
  },

  // Unfollow a user: PUT /api/v1/users/unfollowing/:userIdToUnFollow
  unfollowUser: async (userIdToUnFollow) => {
    const response = await apiClient.put(`/users/unfollowing/${userIdToUnFollow}`);
    return response.data;
  },

  // Block a user: PUT /api/v1/users/block/:userIdToBlock
  blockUser: async (userIdToBlock) => {
    const response = await apiClient.put(`/users/block/${userIdToBlock}`);
    return response.data;
  },

  // Unblock a user: PUT /api/v1/users/unblock/:userIdToUnBlock
  unblockUser: async (userIdToUnBlock) => {
    const response = await apiClient.put(`/users/unblock/${userIdToUnBlock}`);
    return response.data;
  },
};

export default usersApi;


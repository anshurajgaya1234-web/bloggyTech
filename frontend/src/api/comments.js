import apiClient from './client';

export const commentsApi = {
  // Create comment on a post: POST /api/v1/comments/:postId
  createComment: async (postId, message) => {
    const response = await apiClient.post(`/comments/${postId}`, { message });
    return response.data;
  },

  // Update existing comment: PUT /api/v1/comments/:commentId
  updateComment: async (commentId, message) => {
    const response = await apiClient.put(`/comments/${commentId}`, { message });
    return response.data;
  },

  // Delete comment: DELETE /api/v1/comments/:commentId
  deleteComment: async (commentId) => {
    const response = await apiClient.delete(`/comments/${commentId}`);
    return response.data;
  },
};

export default commentsApi;


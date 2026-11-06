import apiClient from './client';

export const postsApi = {
  // Get all posts (authenticated): GET /api/v1/posts
  getAllPosts: async () => {
    const response = await apiClient.get('/posts');
    return response.data;
  },

  // Get single post by id: GET /api/v1/posts/:id
  getPost: async (id) => {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data;
  },

  // Create new post: POST /api/v1/posts (FormData with file, title, content, categoryId)
  createPost: async (formData) => {
    const response = await apiClient.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update existing post: PUT /api/v1/posts/:id
  updatePost: async (id, data) => {
    const response = await apiClient.put(`/posts/${id}`, data);
    return response.data;
  },

  // Delete post: DELETE /api/v1/posts/:id
  deletePost: async (id) => {
    const response = await apiClient.delete(`/posts/${id}`);
    return response.data;
  },

  // Like a post: PUT /api/v1/posts/like/:postId
  likePost: async (postId) => {
    const response = await apiClient.put(`/posts/like/${postId}`);
    return response.data;
  },

  // Dislike a post: PUT /api/v1/posts/dislike/:postId
  dislikePost: async (postId) => {
    const response = await apiClient.put(`/posts/dislike/${postId}`);
    return response.data;
  },

  // Clap a post: PUT /api/v1/posts/claps/:postId
  clapPost: async (postId) => {
    const response = await apiClient.put(`/posts/claps/${postId}`);
    return response.data;
  },

  // Schedule a post: PUT /api/v1/posts/schedule/:postId
  schedulePost: async (postId, scheduledPublish) => {
    const response = await apiClient.put(`/posts/schedule/${postId}`, {
      scheduledPublish,
    });
    return response.data;
  },
};

export default postsApi;


import apiClient from './client';

export const categoriesApi = {
  // Get all categories: GET /api/v1/categories
  getAllCategories: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  // Create new category: POST /api/v1/categories
  createCategory: async (name) => {
    const response = await apiClient.post('/categories', { name });
    return response.data;
  },

  // Update category: PUT /api/v1/categories/:id
  updateCategory: async (id, name) => {
    const response = await apiClient.put(`/categories/${id}`, { name });
    return response.data;
  },

  // Delete category: DELETE /api/v1/categories/:id
  deleteCategory: async (id) => {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  },
};

export default categoriesApi;


import apiClient from './client';

export const authApi = {
  // Register new user: POST /api/v1/users/register
  register: async ({ username, email, password }) => {
    const response = await apiClient.post('/users/register', {
      username,
      email,
      password,
    });
    return response.data;
  },

  // Login user: POST /api/v1/users/login
  login: async ({ username, password }) => {
    const response = await apiClient.post('/users/login', {
      username,
      password,
    });
    return response.data;
  },

  // Forgot password request: PUT /api/v1/users/forgot-password
  forgotPassword: async (email) => {
    const response = await apiClient.put('/users/forgot-password', { email });
    return response.data;
  },

  // Reset password: PUT /api/v1/users/reset-password/:resetToken
  resetPassword: async (resetToken, password) => {
    const response = await apiClient.put(`/users/reset-password/${resetToken}`, {
      password,
    });
    return response.data;
  },

  // Send account verification email: PUT /api/v1/users/account-verification-email
  sendVerificationEmail: async () => {
    const response = await apiClient.put('/users/account-verification-email');
    return response.data;
  },

  // Verify account token: PUT /api/v1/users/verify-account/:verifyToken
  verifyAccount: async (verifyToken) => {
    const response = await apiClient.put(`/users/verify-account/${verifyToken}`);
    return response.data;
  },
};

export default authApi;


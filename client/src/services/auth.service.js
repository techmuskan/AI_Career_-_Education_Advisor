import { apiRequest } from "./api";
import { STORAGE_KEYS } from "../utils/constants";

const persistAuth = ({ token, user }) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }
};

const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

const getStoredUser = () => {
  const rawUser = localStorage.getItem(STORAGE_KEYS.USER);
  return rawUser ? JSON.parse(rawUser) : null;
};

const isAuthenticated = () => Boolean(localStorage.getItem(STORAGE_KEYS.TOKEN));

const signup = async (payload) => {
  const response = await apiRequest("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  persistAuth(response);
  return response;
};

const login = async (payload) => {
  const response = await apiRequest("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  persistAuth(response);
  return response;
};

const getProfile = async () => {
  const response = await apiRequest("/api/v1/auth/getProfile/");
  return response.user;
};

const logout = async () => {
  try {
    await apiRequest("/api/v1/auth/logout");
  } catch {
    // Local logout should still happen even if server logout fails.
  }
  clearAuth();
};

export const authService = {
  signup,
  login,
  getProfile,
  logout,
  clearAuth,
  getStoredUser,
  isAuthenticated,
};
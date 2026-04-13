import { API_BASE_URL, STORAGE_KEYS } from "../utils/constants";

const getToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN);

export const apiRequest = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include"
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Request failed");
  }

  return data;
};
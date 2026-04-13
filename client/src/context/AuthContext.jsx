import { useEffect, useMemo, useState } from "react";
import { authService } from "../services/auth.service";
import { STORAGE_KEYS } from "../utils/constants";
import { AuthContext } from "./auth-context";

const persistUser = (user) => {
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.USER);
    return;
  }

  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

const resolveUser = async (responseUser) => {
  const storedUser = authService.getStoredUser();

  try {
    const profile = await authService.getProfile();
    return {
      ...(storedUser || {}),
      ...(responseUser || {}),
      ...profile
    };
  } catch {
    return {
      ...(storedUser || {}),
      ...(responseUser || {})
    };
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(authService.getStoredUser());
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      if (!authService.isAuthenticated()) {
        setLoadingAuth(false);
        return;
      }

      try {
        const profile = await authService.getProfile();
        const storedUser = authService.getStoredUser();
        const nextUser = storedUser ? { ...storedUser, ...profile } : profile;
        setUser(nextUser);
        persistUser(nextUser);
      } catch {
        authService.clearAuth();
        setUser(null);
      } finally {
        setLoadingAuth(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const nextUser = await resolveUser(response.user);
    setUser(nextUser);
    persistUser(nextUser);
    return response;
  };

  const signup = async (payload) => {
    const response = await authService.signup(payload);
    const nextUser = await resolveUser({
      ...response.user,
      classLevel: payload.classLevel || response.user?.classLevel || ""
    });
    setUser(nextUser);
    persistUser(nextUser);
    return response;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    persistUser(null);
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    loadingAuth,
    login,
    signup,
    logout,
    setUser
  }), [loadingAuth, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

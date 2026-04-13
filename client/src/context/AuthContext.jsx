import { useEffect, useMemo, useState } from "react";
import { authService } from "../services/auth.service";
import { AuthContext } from "./auth-context";

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
        setUser(profile);
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
    setUser(response.user);
    return response;
  };

  const signup = async (payload) => {
    const response = await authService.signup(payload);
    setUser(response.user);
    return response;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
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

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import apiService from "../API/api_service";

const AuthContext = createContext(null);

const KEYS = {
  ACCESS: "access_token",
  REFRESH: "refresh_token",
  DOCTOR_ACCESS: "doctor_access_token",
  DOCTOR_REFRESH: "doctor_refresh_token",
};

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem(KEYS.ACCESS) || null,
  );
  const [refreshToken, setRefreshToken] = useState(
    () => localStorage.getItem(KEYS.REFRESH) || null,
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem(KEYS.ACCESS),
  );
  const [doctorAccessToken, setDoctorAccessToken] = useState(
    () => localStorage.getItem(KEYS.DOCTOR_ACCESS) || null,
  );
  const [doctorRefreshToken, setDoctorRefreshToken] = useState(
    () => localStorage.getItem(KEYS.DOCTOR_REFRESH) || null,
  );
  const [isDoctorAuthenticated, setIsDoctorAuthenticated] = useState(
    () => !!localStorage.getItem(KEYS.DOCTOR_ACCESS),
  );

  /** Save both tokens (call after login / token refresh) */
  const login = useCallback((access, refresh) => {
    localStorage.setItem(KEYS.ACCESS, access);
    localStorage.setItem(KEYS.REFRESH, refresh);
    setAccessToken(access);
    setRefreshToken(refresh);
    setIsAuthenticated(true);
  }, []);

  /** Clear tokens (call on logout) */
  const logout = useCallback(async () => {
    try {
      if (localStorage.getItem(KEYS.ACCESS)) {
        await apiService.post("/logout");
      }
    } catch (err) {
      console.warn("Backend logout failed, clearing local tokens anyway", err);
    } finally {
      localStorage.removeItem(KEYS.ACCESS);
      localStorage.removeItem(KEYS.REFRESH);
      setAccessToken(null);
      setRefreshToken(null);
      setIsAuthenticated(false);
    }
  }, []);

  /** Update only the access token (call after silent refresh) */
  const updateAccessToken = useCallback((access) => {
    localStorage.setItem(KEYS.ACCESS, access);
    setAccessToken(access);
  }, []);

  /** Exchange refresh token for new tokens via POST /refresh */
  const refresh = useCallback(async () => {
    const stored = localStorage.getItem(KEYS.REFRESH);
    if (!stored) throw new Error("No refresh token available");
    const data = await apiService.refreshToken(stored);
    // backend returns { refreshToken, accessToken }
    localStorage.setItem(KEYS.ACCESS, data.accessToken);
    localStorage.setItem(KEYS.REFRESH, data.refreshToken);
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    return data;
  }, []);

  /** Verify the current access token via POST /verify */
  const verify = useCallback(async () => {
    try {
      const data = await apiService.verifyUser(); // { success, user }
      setIsAuthenticated(!!data?.success);
      return data;
    } catch {
      setIsAuthenticated(false);
      return { success: false };
    }
  }, []);

  const doctorLogin = useCallback((access, refresh) => {
    localStorage.setItem(KEYS.DOCTOR_ACCESS, access);
    localStorage.setItem(KEYS.DOCTOR_REFRESH, refresh);
    setDoctorAccessToken(access);
    setDoctorRefreshToken(refresh);
    setIsDoctorAuthenticated(true);
  }, []);

  // Listen for forced logout triggered by the axios interceptor
  useEffect(() => {
    const handleForceLogout = () => {
      setAccessToken(null);
      setRefreshToken(null);
      setIsAuthenticated(false);
    };
    window.addEventListener("auth:logout", handleForceLogout);
    return () => window.removeEventListener("auth:logout", handleForceLogout);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        isAuthenticated,
        login,
        logout,
        updateAccessToken,
        refresh,
        verify,
        doctorLogin,
        doctorAccessToken,
        doctorRefreshToken,
        isDoctorAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/** Hook to consume auth context */
export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return context;
}

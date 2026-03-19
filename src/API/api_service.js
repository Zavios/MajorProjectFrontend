import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

class ApiService {
  constructor() {
    console.log(BACKEND_URL);
    this.axios = axios.create({
      baseURL: BACKEND_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor – attach access token
    this.axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor – silent token refresh on 401
    this._setupRefreshInterceptor();
  }

  _setupRefreshInterceptor() {
    this.axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const original = error.config;
        if (error.response?.status === 401 && !original._retry) {
          original._retry = true;
          const storedRefresh = localStorage.getItem("refresh_token");
          if (storedRefresh) {
            try {
              const { refreshToken: newAccess, accessToken: newRefresh } =
                await this.refreshToken(storedRefresh);
              localStorage.setItem("access_token", newAccess);
              localStorage.setItem("refresh_token", newRefresh);
              original.headers.Authorization = `Bearer ${newAccess}`;
              return this.axios(original);
            } catch (_) {
              // Refresh also failed – clear everything
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              window.dispatchEvent(new Event("auth:logout"));
            }
          }
        }
        return Promise.reject(error);
      },
    );
  }

  // GET request
  async get(path, params = {}) {
    try {
      const response = await this.axios.get(path, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // POST request
  async post(path, data = {}) {
    try {
      console.log(path);
      const response = await this.axios.post(path, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // PUT / UPDATE request
  async put(path, data = {}) {
    try {
      const response = await this.axios.put(path, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // DELETE request
  async delete(path) {
    try {
      const response = await this.axios.delete(path);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // POST /refresh – exchange refresh token for new tokens
  async refreshToken(refresh_token) {
    try {
      const response = await this.axios.post("/refresh", { refresh_token });
      return response.data; // { refreshToken, accessToken }
    } catch (error) {
      this.handleError(error);
    }
  }

  // POST /verify – validate the current access token
  async verifyUser() {
    try {
      const response = await this.axios.post("/verify");
      return response.data; // { success, user }
    } catch (error) {
      this.handleError(error);
    }
  }

  // Centralized error handling
  handleError(error) {
    if (error.response) {
      console.error("API Error:", error.response.data);
      throw error.response.data;
    } else if (error.request) {
      console.error("No response from server");
      throw { message: "No response from server" };
    } else {
      console.error("Error:", error.message);
      throw { message: error.message };
    }
  }
}

export default new ApiService();

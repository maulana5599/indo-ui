// src/api.js
import axios from "axios";
import Swal from "sweetalert2";

const baseUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Cek Method
    if (config.method === "post" || config.method === "put" || config.method === "delete") {
      Swal.fire({
        title: "Loading",
        text: "Please wait...",
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let isSignin = false;
    if (error.config?.headers?.isSignin) {
      isSignin = true;
    }

    if (error.response?.status === 401 && !isSignin) {
      localStorage.removeItem("token");
      window.location.href = "/signin";
    }

    // Jika ada error khusus dari server
    if (error.response?.status === 403) {
      console.error("Forbidden");
    }

    return Promise.reject(error);
  }
);

export default api;

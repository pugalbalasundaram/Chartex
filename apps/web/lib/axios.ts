import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Required for cookie-based anonymous sessions
});

export default api;
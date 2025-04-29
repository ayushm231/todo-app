import axios from "axios"

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
})

// Added interceptor to set X-User-ID before every request
instance.interceptors.request.use((config) => {
  const userId = localStorage.getItem("userId")
  if (userId) {
    config.headers["X-User-ID"] = userId
  }
  return config
})

export default instance

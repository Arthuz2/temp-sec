import axios from "axios";

const api = axios.create({
  baseURL: "http://54.232.67.242:5000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

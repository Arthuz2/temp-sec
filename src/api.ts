import axios from "axios";

const api = axios.create({
  baseURL: "https://nslagroshow.duckdns.org/",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

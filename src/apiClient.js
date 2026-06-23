// バックエンド側からデータを受け取るjs

import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080", // 🌟 ベースのURLをここに一元管理！
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;

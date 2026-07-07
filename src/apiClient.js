// バックエンド側からデータを受け取るjs

import axios from "axios";

const apiClient = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  // サーバーが JSON ではなく単なる文字列を返す場合、これを追加
  transformResponse: [
    function (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error(e);
        return data; // JSON パースに失敗したらそのまま返す
      }
    },
  ],
});

export default apiClient;

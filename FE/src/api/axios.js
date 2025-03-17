import axios from "axios";

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // 쿠키를 요청에 포함
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // accessToken을 Authorization 헤더에 포함시킴
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  // 에러를 거절 상태로 반환하여, 이후 처리를 catch 등의 방식으로 할 수 있게 함
  (error) => Promise.reject(error),
);

export default api;

import api from "./axios"

const ENDPOINT = "/auth";

const authApi = {
  // 로그인
  login: async (formData) => {
    const response = await api.post(`${ENDPOINT}/login`, formData, { withCredentials: true });
    return response;
  },

  // RefreshToken 검증 및 AccessToken 재발급 요청
  reissue: async () => {
    const response = await api.get(`${ENDPOINT}/reissue`, formData, { withCredentials: true });
    return response;
  },
};

export default authApi;
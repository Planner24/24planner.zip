import api from './axios';

const ENDPOINT = '/auth';

const authApi = {
  // 로그인
  login: async (formData) => {
    const response = await api.post(`${ENDPOINT}/login`, formData, { withCredentials: true });
    return response;
  },

  // RefreshToken 검증 및 AccessToken 재발급 요청
  reissue: async () => {
    const response = await api.get(`${ENDPOINT}/reissue`, {}, { withCredentials: true });
    return response;
  },

  // 로그아웃
  logout: async () => {
    const response = await api.delete(`${ENDPOINT}/logout`, {}, { withCredentials: true });
  },

  // 테스트
  test: async () => {
    const response = await api.get(`/test`);
  },
};

export default authApi;

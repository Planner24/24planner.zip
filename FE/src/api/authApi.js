import api from "./axios"

const ENDPOINT = "/auth";

const authApi = {

  // 로그인
  login: async (formData) => {
      const response = await api.post(`${ENDPOINT}/login`, formData);
      return response;
  }

};

export default authApi;
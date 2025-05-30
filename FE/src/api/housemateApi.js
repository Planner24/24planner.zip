import api from './axios';

const ENDPOINT = '/plans';

const housemateApi = {
  // 동거인 초대 링크 생성
  createInvitationLink: async (movingPlanId) => {
    const response = await api.post(`${ENDPOINT}/${movingPlanId}/housemates/invite`);
    return response;
  },

  // 동거인 초대 링크 토큰 검증
  validateInvitation: async (code) => {
    const response = await api.get(`${ENDPOINT}/invitations/validate`, { params: { code } });
    return response;
  },

  // 동거인 초대 링크 수락
  acceptInvitation: async (code) => {
    const response = await api.post(`${ENDPOINT}/invitations/accept`, { code });
    return response;
  },

  // 동거인 삭제
  deleteHousemate: async (movingPlanId, housemateId) => {
    const response = await api.delete(`${ENDPOINT}/${movingPlanId}/housemates/${housemateId}`);
    return response;
  },
};

export default housemateApi;

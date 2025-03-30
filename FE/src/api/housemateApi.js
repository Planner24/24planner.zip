import api from './axios';

const ENDPOINT = '/plans';

const housemateApi = {
  // 동거인 삭제
  deleteHousemate: async (movingPlanId, housemateId) => {
    const response = await api.delete(`${ENDPOINT}/${movingPlanId}/housemates/${housemateId}`);
    return response;
  },
};

export default housemateApi;

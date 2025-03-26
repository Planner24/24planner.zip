import api from './axios';

const ENDPOINT = '/plans';

const scheduleApi = {
  createSchedule: async (movingPlanId, formData) => {
    const response = await api.post(`${ENDPOINT}/${movingPlanId}/schedules`, formData);
    return response;
  },
};

export default scheduleApi;

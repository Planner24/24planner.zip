import api from './axios';

const ENDPOINT_FIRST = '/plans';
// const ENDPOINT_SECOND = '/taskgroups'
// const ENDPOINT_THIRD = '/tasks'

const taskApi = {
  // 체크포인트 리스트 조회 (+ 그룹 메모)
  getTasks: async (movingPlanId, taskGroupId) => {
    const response = await api.get(
      `${ENDPOINT_FIRST}/${movingPlanId}/taskgroups/${taskGroupId}/tasks`,
    );
    return response;
  },
};

export default taskApi;

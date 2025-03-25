import api from './axios';

const ENDPOINT_FIRST = '/plans';
// const ENDPOINT_SECOND = '/taskgroups'
// const ENDPOINT_THIRD = '/tasks'

const taskGroupApi = {
  // 체크포인트 리스트 조회 (+ 그룹 메모)
  updateTitle: async (movingPlanId, taskGroupId, title) => {
    const response = await api.patch(
      `${ENDPOINT_FIRST}/${movingPlanId}/taskgroups/${taskGroupId}/title`,
      title,
    );
    return response;
  },
};

export default taskGroupApi;

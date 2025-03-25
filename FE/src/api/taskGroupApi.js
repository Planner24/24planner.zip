import api from './axios';

const ENDPOINT = '/plans';

const taskGroupApi = {
  // 체크 그룹 제목 수정
  updateTitle: async (movingPlanId, taskGroupId, title) => {
    const response = await api.patch(
      `${ENDPOINT}/${movingPlanId}/taskgroups/${taskGroupId}/title`,
      title,
    );
    return response;
  },

  // 체크 그룹 삭제
  deleteTaskGroup: async (movingPlanId, taskGroupId) => {
    const response = await api.delete(`${ENDPOINT}/${movingPlanId}/taskgroups/${taskGroupId}`);
    return response;
  },
};

export default taskGroupApi;

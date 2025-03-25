import api from './axios';

const ENDPOINT = '/plans';

const taskApi = {
  // 체크포인트 리스트 조회 (+ 그룹 메모)
  getTasks: async (movingPlanId, taskGroupId) => {
    const response = await api.get(`${ENDPOINT}/${movingPlanId}/taskgroups/${taskGroupId}/tasks`);
    return response;
  },

  // 체크포인트 삭제
  deleteTask: async (movingPlanId, taskGroupId, taskId) => {
    const response = await api.delete(
      `${ENDPOINT}/${movingPlanId}/taskgroups/${taskGroupId}/tasks/${taskId}`,
    );
  },
};

export default taskApi;

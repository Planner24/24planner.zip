import { useNavigate, useParams } from 'react-router-dom';
import TaskGroupBox from '../component/TaskGroup/TaskGroupBox';
import { useEffect, useState } from 'react';
import taskGroupApi from '../api/taskGroupApi';

export default function TaskGroups() {
  const { movingPlanId } = useParams();
  const [totalProgress, setTotalProgress] = useState();
  const [taskGroups, setTaskGroups] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getTaskGroups = async () => {
      try {
        const response = await taskGroupApi.getTaskGroups(movingPlanId);
        const code = response.code;
        const message = response.message;
        const data = response.data;
        setTaskGroups(data.taskGroups);
        setTotalProgress(data.totalProgress);
      } catch (error) {
        const errorData = error.response.data;
        const code = errorData.code;
        const message = errorData.message;
      }
    };
    getTaskGroups();
  }, [totalProgress]);

  // CSS
  // px: 가로padding py: 세로 패딩
  // w-25: width: 25px * 4
  //
  const section = 'px-15 py-3.75 flex flex-col items-center';
  const totalGaugeFontSize = 'font-roboto text-xl font-bold';
  const progress = 'w-215 h-10 border-2 rounded-full m-5 px-2 py-1 border-primary bg-primary';
  const house =
    'w-215 border-2 rounded-3xl m-5 px-2 py-5  border-4 border-primary text-lg text-black text-center font-bold bg-white font-roboto';

  return (
    <section className={`${section}`}>
      <div>
        <span className={`${totalGaugeFontSize}`}>이사</span>
        <span className={`${totalGaugeFontSize} text-primary`}> {totalProgress}%</span>
        <span className={`${totalGaugeFontSize}`}> 완료!</span>
      </div>
      <div className={`${progress}`}></div>
      <div
        className={`${house}`}
        onClick={() => {
          navigate(`/plans/${movingPlanId}/house`);
        }}
      >
        살 곳 정하기
      </div>

      <TaskGroupBox taskGroups={taskGroups} setTaskGroups={setTaskGroups}></TaskGroupBox>
    </section>
  );
}

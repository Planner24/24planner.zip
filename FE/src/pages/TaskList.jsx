import { useNavigate, useParams } from 'react-router-dom';
import TaskGroupInfo from '../component/taskList/TaskGroupInfo';
import TaskGroupMemo from '../component/taskList/TaskGroupMemo';
import TaskListSection from '../component/taskList/TaskListSection';
import { useEffect, useState } from 'react';
import taskApi from '../api/taskApi';

export default function TaskList() {
  const navigate = useNavigate();

  // 파라미터
  const { movingPlanId } = useParams();
  const { taskGroupId } = useParams();

  // 상태 관리 데이터
  const [taskList, setTaskList] = useState({
    title: '',
    totalCount: 0,
    completeCount: 0,
    tasks: [],
    memo: '',
  });

  const { title, totalCount, completeCount, tasks, memo } = taskList;

  // 체크포인트 리스트 가져오기
  useEffect(() => {
    async function fetchTaskLists() {
      try {
        const response = await taskApi.getTasks(movingPlanId, taskGroupId);
        const data = response.data.data;

        setTaskList(data);
      } catch (error) {
        // 임시로 만들어놓은 not-found
        if (error.response.data.code == 'NOT_FOUND') {
          navigate('/not-found');
        }
      }
    }
    fetchTaskLists();
  }, [movingPlanId, taskGroupId]);

  // CSS
  const mainStyle = 'flex flex-col justify-center items-center mx-60 my-15 box-border max-w-200';

  return (
    <main className={mainStyle}>
      <TaskGroupInfo title={title} setTaskList={setTaskList}></TaskGroupInfo>
      <TaskListSection
        totalCount={totalCount}
        completeCount={completeCount}
        tasks={tasks}
        setTaskList={setTaskList}
      ></TaskListSection>
      <TaskGroupMemo memo={memo} setTaskList={setTaskList}></TaskGroupMemo>
    </main>
  );
}

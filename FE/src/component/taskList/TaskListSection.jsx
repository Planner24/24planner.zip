import { useEffect, useState } from 'react';
import Task from './Task';

export default function TaskListSection({ totalCount, completeCount, tasks }) {
  // 상태 관리 데이터
  const [taskList, setTaskList] = useState(tasks);

  // 체크리스트 변경 시 화면 렌더링
  useEffect(() => {
    setTaskList(tasks);
  }, [tasks]);

  // CSS
  const checkpointWrapperStyle = 'w-full';
  const checkpointCountingStyle = 'text-right text-xl text-primary mb-2 pr-7';
  const checkpointListStyle =
    'border rounded-3xl border-primary border-2 mb-10 px-18 py-12 h-120 overflow-y-auto';

  return (
    <section className={checkpointWrapperStyle}>
      <div className={checkpointCountingStyle}>
        {completeCount} / {totalCount}
      </div>
      <ul className={checkpointListStyle}>
        {taskList?.map((task) => {
          return <Task key={task.id} task={task} setTaskList={setTaskList}></Task>;
        })}
      </ul>
    </section>
  );
}

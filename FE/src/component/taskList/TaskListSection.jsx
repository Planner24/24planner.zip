import { useEffect, useState } from 'react';
import Task from './Task';
import taskApi from '../../api/taskApi';
import { useParams } from 'react-router-dom';

export default function TaskListSection({ totalCount, completeCount, tasks }) {
  // 파라미터
  const { movingPlanId } = useParams();
  const { taskGroupId } = useParams();

  // 상태 관리 데이터
  const [taskList, setTaskList] = useState(tasks);
  const [newContent, setNewContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // 체크리스트 변경 시 화면 렌더링
  useEffect(() => {
    setTaskList(tasks);
  }, [tasks]);

  // 체크포인트 추가하기 클릭
  const handleClickCreateButton = (e) => {
    setIsEditing(true);
  };

  // 체크포인트 내용 입력
  const handleInputNewContent = (e) => {
    setNewContent(e.target.value);
  };

  // 체크포인트 생성
  const handleCreateCheckPoint = async (e) => {
    try {
      const response = await taskApi.createTask(movingPlanId, taskGroupId, newContent);
      const task = response.data.data;

      setNewContent('');
      setTaskList((prevList) => [...prevList, task]);
      setIsEditing(false);
    } catch (error) {}
  };

  // 엔터키 눌러 체크포인트 생성
  const handlePressEnter = (e) => {
    if (e.key === 'Enter') {
      handleCreateCheckPoint();
    }
  };

  // CSS
  const checkpointWrapperStyle = 'w-full';
  const checkpointCountingStyle = 'text-right text-xl text-primary mb-2 pr-7';
  const checkpointListStyle =
    'border rounded-3xl border-primary border-2 mb-10 px-18 py-12 h-120 overflow-y-auto';
  const checkpointStyle = 'flex items-center gap-5';
  const checkBoxStyle = 'hidden peer';
  const checkBoxLabelStyle =
    'min-w-6 min-h-6 w-6 h-6 flex items-center justify-center rounded-md border-2 border-gray-400 cursor-pointer';
  const checkpointContentStyle = 'text-gray-400';
  const inputNewContentStyle = 'focus:outline-none border-b border-gray-400 w-full break-all';

  return (
    <section className={checkpointWrapperStyle}>
      <div className={checkpointCountingStyle}>
        {completeCount} / {totalCount}
      </div>
      <ul className={checkpointListStyle}>
        {taskList?.map((task) => {
          return <Task key={task.id} task={task} setTaskList={setTaskList}></Task>;
        })}
        <li className={checkpointStyle}>
          <input type="checkbox" id="createButton" className={checkBoxStyle} />
          <label htmlFor="createButton" className={checkBoxLabelStyle}></label>
          {isEditing ? (
            <input
              type="text"
              name="content"
              id="content"
              value={newContent || ''}
              className={inputNewContentStyle}
              onChange={handleInputNewContent}
              onBlur={handleCreateCheckPoint}
              onKeyDown={handlePressEnter}
            />
          ) : (
            <>
              <div className={checkpointContentStyle} onClick={handleClickCreateButton}>
                체크포인트 추가하기
              </div>
            </>
          )}
        </li>
      </ul>
    </section>
  );
}

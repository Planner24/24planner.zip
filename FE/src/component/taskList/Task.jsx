import { useParams } from 'react-router-dom';
import taskApi from '../../api/taskApi';

export default function Task({ task, setTaskList }) {
  const { id, content, isCompleted } = task;

  // 파라미터
  const { movingPlanId } = useParams();
  const { taskGroupId } = useParams();

  // 체크포인트 삭제
  const handleClickDeleteButton = async () => {
    try {
      await taskApi.deleteTask(movingPlanId, taskGroupId, id);
      setTaskList((prevTaskList) =>
        prevTaskList.filter((prevTask) => {
          const prevTaskId = prevTask.id;
          return prevTaskId !== id;
        }),
      );
    } catch (error) {}
  };

  // CSS
  const taskInfoStyle = 'flex justify-between box-border mb-10';
  const taskStyle = 'flex gap-5';
  const checkBoxStyle = 'hidden peer';
  const checkBoxLabelStyle =
    'min-w-6 min-h-6 w-6 h-6 flex justify-center items-center rounded-md border-2 border-primary cursor-pointer peer-checked:bg-primary peer-checked:border-primary peer-checked:before:content-["✔"] peer-checked:before:text-white';
  const taskContentStyle = "break-all mr-5"
  const deleteTaskStyle = 'text-gray-500 text-opacity-70 cursor-pointer';

  return (
    <li className={taskInfoStyle}>
      <div className={taskStyle}>
        <input type="checkbox" id={id} className={checkBoxStyle} />
        <label htmlFor={id} className={checkBoxLabelStyle}></label>
        <div className={taskContentStyle}>{content}</div>
      </div>
      <div className={deleteTaskStyle} onClick={handleClickDeleteButton}>
        ✕
      </div>
    </li>
  );
}

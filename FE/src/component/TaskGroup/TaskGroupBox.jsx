import { useRef, useState } from 'react';
import taskGroupApi from '../../api/taskGroupApi';
import { useNavigate, useParams } from 'react-router-dom';

export default function TaskGroupBox({ taskGroups }) {
  const { movingPlanId } = useParams();

  const [clickAdd, setClickAdd] = useState(false);
  const [message, setMessage] = useState();
  const [formData, setFormData] = useState({ title: '' });
  const [Groups, setGroups] = useState([]);

  console.log(taskGroups);

  const taskGroupText = useRef();
  const navigate = useNavigate();

  const blockParentEvent = (e) => {
    e.stopPropagation(); //부모 태그로 이벤트 전파 방지
    setMessage();
  };

  const addTaskGroup = async (e) => {
    e.stopPropagation(); //부모 태그로 이벤트 전파 방지
    const inputValue = taskGroupText.current.value;
    setFormData({ title: inputValue });

    try {
      const response = await taskGroupApi.postTaskGroup(movingPlanId, { title: inputValue });
      console.log(response);

      const code = response.code;
      if (code === 'CREATED') {
        setClickAdd(false);
        setMessage();
      }
    } catch (error) {
      const errorData = error.response.data;
      const code = errorData.code;
      const message = errorData.message;

      if (code === 'BAD_REQUEST') {
        setMessage(message);
      } else if (code === 'INVALID_TOKEN') {
        setMessage('작성 권한이 없습니다. 로그인 후 다시 이용하세요');
      } else if (code === 'NOT_FOUND') {
        navigate('/not-found');
      }
    }
  };

  const section = 'm-10 grid grid-cols-2 gap-4';
  const groupBox =
    'w-100 h-35 border-3 rounded-3xl px-2 py-5 bg-white font-roboto flex flex-col items-center justify-center';
  const boxText = 'text-lg font-roboto pr-60 m-3';
  const progress = 'w-90 h-7 border-2 rounded-full px-2 py-1 border-primary bg-primary ';
  const addBox =
    'w-100 h-35 border-3 border-gray-300 rounded-3xl px-2 py-5 flex items-center justify-center';
  const addBoxText = 'text-gray-300 text-2xl font-roboto ';
  const changeAddBox =
    'w-100 h-35 border-3 rounded-3xl px-2 py-5 flex flex-col items-center justify-center';
  const addBtn =
    'w-20 border-2 rounded-xl px-2 py-1 border-primary text-primary hover:bg-primary hover:text-white cursor-pointer';
  const inputText =
    'w-50 border-3 border-b-gray-300 border-x-white border-t-white m-5 placeholder:text-gray-300';
  const messageStyle = 'font-semibold text-red-400';

  return (
    <section className={`${section}`}>
      {taskGroups.map((task) => (
        <div key={task.id} className={`${groupBox}`}>
          <span className={`${boxText}`}>{task.title}</span>
          <div className={`${progress}`}></div>
        </div>
      ))}

      {clickAdd ? (
        <div
          className={`${changeAddBox}`}
          onClick={() => {
            setClickAdd(false);
          }}
        >
          <div>
            <input
              ref={taskGroupText}
              className={`${inputText}`}
              onClick={blockParentEvent}
              type="text"
              placeholder="체크 그룹 추가"
              required
            />
            <button className={`${addBtn}`} onClick={addTaskGroup}>
              추가
            </button>
          </div>
          {message && <span className={`${messageStyle}`}>{message}</span>}
        </div>
      ) : (
        <div
          className={`${addBox}`}
          onClick={(click) => {
            setClickAdd(true);
            setMessage();
          }}
        >
          <span className={`${addBoxText}`}>+</span>
        </div>
      )}
    </section>
  );
}

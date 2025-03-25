import { useRef, useState } from 'react';
import taskGroupsApi from '../../api/taskGroupsApi';
import { useNavigate, useParams } from 'react-router-dom';

export default function TaskGroupBox() {
  const [clickAdd, setClickAdd] = useState(false);
  const [message, setMessage] = useState();
  const { movingPlanId } = useParams();

  const taskGroupText = useRef();
  const navigate = useNavigate();

  // 요청 값
  const [formData, setFormData] = useState({ title: '' });

  const addTaskGroup = async () => {
    const inputValue = taskGroupText.current.value;
    setFormData({ title: inputValue });

    try {
      const response = await taskGroupsApi.postTaskGroup(movingPlanId, { title: inputValue });
      console.log(response);

      const code = response.code;
      if (code === 'CREATED') {
        setClickAdd(false);
        setMessage();
      }
    } catch (error) {
      const errordata = error.response.data;
      const code = errordata.code;
      const message = errordata.message;

      if (code === 'BAD_REQUEST') {
        setMessage(message);
      } else if (code === 'INVALID_TOKEN') {
        setMessage('작성 권한이 없습니다. 로그인 후 다시 이용하세요');
      } else if (code === 'NOT_FOUND') {
        navigate('/not-found');
      }
    }
  };

  const section = 'flex flex-wrap gap-5 justify-center';
  const groupBox =
    'w-100 h-35 border-3 rounded-3xl px-2 py-5 bg-white font-roboto flex flex-col items-center justify-center';
  const boxText = 'text-lg font-roboto pr-60 m-3';
  const gauge = 'w-90 h-7 border-2 rounded-full px-2 py-1 border-primary bg-primary ';
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
      <div className={`${groupBox}`}>
        <span className={`${boxText}`}>체크 그룹1</span>
        <div className={`${gauge}`}></div>
      </div>

      {clickAdd ? (
        <div className={`${changeAddBox}`}>
          <div>
            <input
              ref={taskGroupText}
              className={`${inputText}`}
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
          }}
        >
          <span className={`${addBoxText}`}>+</span>
        </div>
      )}
    </section>
  );
}

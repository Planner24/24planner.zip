import { useState } from 'react';
import { useParams } from 'react-router-dom';

import scheduleApi from '../../api/scheduleApi';

export default function CalendarSidebar({ selectDate, scheduleList }) {
  // Tailwind CSS에서 사용할 색상 Class들을 미리 선언
  // TODO: 임시적인 목록이므로, 추후 변경될 수 있음
  const tempUsingColor = ['bg-[#69db7c]', 'bg-[#4dabf7]', 'bg-[#2f9e44]', 'bg-[#fcc2d7]'];

  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const { movingPlanId } = useParams();

  const calendarSidebarStyle = 'flex flex-1 flex-col items-center m-4';
  const scheduleDateStyle = 'text-xl mt-12';
  const scheduleListStyle = 'flex flex-col w-full mt-8';
  const scheduleElementDivStyle = 'flex items-center';
  const scheduleElementContentStyle = 'flex justify-center items-center rounded-3xl w-full p-2 m-2';
  const deleteButtonDivStyle = 'text-gray-500 text-opacity-70 cursor-pointer';
  const inputDivStyle =
    'flex justify-center items-center border-1 border-gray-300 rounded-3xl w-full py-2 m-2 h-10';
  const inputStyle = 'focus:outline-none w-full p-4';
  const addButtonStyle =
    'flex justify-center items-center mx-1 px-4 bg-primary rounded-3xl h-10 cursor-pointer';

  const dailyScheduleList = [];
  if (selectDate) {
    const selectDateInt = parseIntFromDate(selectDate);
    scheduleList.forEach((schedule) => {
      let startInt = parseIntFromDate(schedule.startDate);
      let endInt = parseIntFromDate(schedule.endDate);
      if (selectDateInt >= startInt && selectDateInt <= endInt) {
        dailyScheduleList.push(schedule);
      }
    });
  }

  const handleContentChange = (e) => {
    setContent(() => e.target.value);
    setErrorMessage(() => null);
  };

  const handleAddButton = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!content.length) {
      setErrorMessage(() => '내용은 필수로 입력해야 합니다.');
    } else {
      try {
        const response = await scheduleApi.createSchedule(movingPlanId, {
          content: content,
          startDate: selectDate,
          endDate: selectDate,
          color: '#69DB7C',
        });
        setContent(() => '');
      } catch (err) {
        setErrorMessage(() => '등록 도중 오류가 발생했습니다.');
        console.log(err);
      }
    }
  };

  return (
    <section className={calendarSidebarStyle}>
      {selectDate ? (
        <>
          <div className={scheduleDateStyle}>
            {Number.parseInt(selectDate.substring(0, 4))}년{' '}
            {Number.parseInt(selectDate.substring(5, 7))}월{' '}
            {Number.parseInt(selectDate.substring(8, 10))}일
          </div>
          <div className={scheduleListStyle}>
            {dailyScheduleList.map((schedule, i) => {
              return (
                <div key={i} className={scheduleElementDivStyle}>
                  <div className={`${scheduleElementContentStyle} bg-[${schedule.color}]`}>
                    {schedule.content}
                  </div>
                  <div className={deleteButtonDivStyle}>✕</div>
                </div>
              );
            })}
            <div className={scheduleElementDivStyle}>
              <div className={inputDivStyle}>
                <input
                  type="text"
                  className={inputStyle}
                  placeholder="할 일 입력"
                  value={content}
                  onChange={handleContentChange}
                />
              </div>
              <div className={addButtonStyle} onClick={handleAddButton}>
                +
              </div>
            </div>
            <div className="px-4 mx-2 text-red-300">{errorMessage ? errorMessage : '\u00A0'}</div>
          </div>
        </>
      ) : (
        <></>
      )}
    </section>
  );
}

function parseIntFromDate(date) {
  return (
    Number.parseInt(date.substring(0, 4)) * 10000 +
    Number.parseInt(date.substring(5, 7)) * 100 +
    Number.parseInt(date.substring(8, 10))
  );
}

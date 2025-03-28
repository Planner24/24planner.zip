import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import scheduleApi from '../../api/scheduleApi';

import calendarUtil from './util/calendarUtil';

export default function CalendarSidebar({
  yearState,
  monthState,
  selectDate,
  dailyScheduleList,
  setDailyScheduleList,
  setMonthlyEventList,
  setIsShowingModal,
  setShowingScheduleToModal,
}) {
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const { movingPlanId } = useParams();

  const loadList = async () => {
    setDailyScheduleList(() => []);
    try {
      const response = await scheduleApi.getDailySchedule(movingPlanId, selectDate);
      setDailyScheduleList(() => response.data.data.schedules);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setErrorMessage(() => null);
    setContent(() => '');
    loadList();
  }, [selectDate]);

  const handleContentChange = (e) => {
    setContent(() => e.target.value.substring(0, 20));
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

        const newSchedule = response.data.data;
        setDailyScheduleList((prev) => [...prev, newSchedule]);
        setContent(() => '');

        const selectedYear = Number.parseInt(selectDate.substring(0, 4));
        const selectedMonth = Number.parseInt(selectDate.substring(5, 7));
        if (selectedYear === yearState && selectedMonth === monthState) {
          setMonthlyEventList((prev) => [...prev, calendarUtil.scheduleToEvent(newSchedule)]);
        }
      } catch (err) {
        setErrorMessage(() => '등록 도중 오류가 발생했습니다.');
        console.log(err);
      }
    }
  };

  const modalForUpdateSchedule = async (e, schedule) => {
    setShowingScheduleToModal(() => schedule);
    setIsShowingModal(() => true);
  };

  const deleteSchedule = async (e, scheduleId) => {
    try {
      const response = await scheduleApi.deleteSchedule(movingPlanId, scheduleId);
      setDailyScheduleList((prev) => prev.filter((schedule) => schedule.id !== scheduleId));
      setMonthlyEventList((prev) => prev.filter((event) => event.scheduleId !== scheduleId));
    } catch (err) {
      console.log(err);
    }
  };

  const calendarSidebarStyle = 'flex flex-1 flex-col items-center m-4';
  const scheduleDateStyle = 'text-xl mt-12';
  const scheduleListStyle = 'flex flex-col w-full mt-8';
  const scheduleElementDivStyle = 'flex items-center';
  const scheduleElementContentStyle = 'flex justify-center items-center rounded-3xl w-full p-2 m-2';
  const deleteButtonDivStyle = 'text-gray-500 text-opacity-70 cursor-pointer';
  const inputDivStyle =
    'flex justify-center items-center border-1 border-gray-300 rounded-3xl w-full py-2 pr-5 m-2 h-10';
  const inputStyle = 'focus:outline-none w-full p-4';
  const addButtonStyle =
    'flex justify-center items-center mx-1 px-4 bg-primary rounded-3xl h-10 cursor-pointer';

  const dailyScheduleListDiv = dailyScheduleList.map((schedule, i) => {
    return (
      <div key={i} className={scheduleElementDivStyle}>
        <div
          className={`${scheduleElementContentStyle} bg-[${schedule.color}] ${calendarUtil.determineBlackText(calendarUtil.hexColorToIntArray(schedule.color)) ? 'text-black' : 'text-white'}`}
          onClick={(e) => {
            modalForUpdateSchedule(e, schedule);
          }}
        >
          {schedule.content}
        </div>
        <div
          className={deleteButtonDivStyle}
          onClick={(e) => {
            deleteSchedule(e, schedule.id);
          }}
        >
          ✕
        </div>
      </div>
    );
  });

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
            {dailyScheduleListDiv}
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

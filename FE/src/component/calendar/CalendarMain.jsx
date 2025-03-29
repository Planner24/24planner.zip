import { useRef } from 'react';

import './style/calendarMain.css';
import CalendarContent from './CalendarContent';
import CalendarHeader from './CalendarHeader';

export default function CalendarMain({
  yearState,
  setYearState,
  monthState,
  setMonthState,
  selectDate,
  setSelectDate,
  monthlyEventList,
  setMonthlyEventList,
  setIsShowingModal,
  setShowingScheduleToModal,
}) {
  const calendarRef = useRef(null);

  const calendarMainStyle = 'flex flex-col flex-2 h-full w-full border-r-1 border-gray-300 my-4';
  const calendarPaddingStyle = 'px-8';

  return (
    <section className={calendarMainStyle}>
      <div className={calendarPaddingStyle}>
        <CalendarHeader
          calendarRef={calendarRef}
          yearState={yearState}
          setYearState={setYearState}
          monthState={monthState}
          setMonthState={setMonthState}
          setIsShowingModal={setIsShowingModal}
          setShowingScheduleToModal={setShowingScheduleToModal}
        />
        <CalendarContent
          calendarRef={calendarRef}
          setYearState={setYearState}
          setMonthState={setMonthState}
          monthlyEventList={monthlyEventList}
          setMonthlyEventList={setMonthlyEventList}
          selectDate={selectDate}
          setSelectDate={setSelectDate}
        />
      </div>
    </section>
  );
}

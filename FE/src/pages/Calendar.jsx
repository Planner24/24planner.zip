import { useState } from 'react';
import CalendarContent from '../component/calendar/CalendarContent';
import CalendarSidebar from '../component/calendar/CalendarSidebar';

export default function Calendar() {
  const now = new Date();
  const [yearState, setYearState] = useState(now.getFullYear());
  const [monthState, setMonthState] = useState(now.getMonth() + 1);
  const [selectDate, setSelectDate] = useState(
    parseDate(now.getFullYear(), now.getMonth() + 1, now.getDate()),
  );
  /* 
    Schedule은 DB에서 받아오는 형식을 그대로 사용함을 의미
    Event는 DB에서 받은 Schedule을 달력에 적용할 수 있게 변형된 데이터 형식으로 저장된다는 의미
    일정 추가 시 State를 통한 자동 렌더링을 원할하게 구현할 수 있도록 부득이하게 별도 관리
  */
  const [monthlyEventList, setMonthlyEventList] = useState([]);
  const [dailyScheduleList, setDailyScheduleList] = useState([]);

  const calendarMainStyle = 'flex justify-center h-full px-2 pb-4';

  return (
    <main className={calendarMainStyle}>
      <CalendarContent
        yearState={yearState}
        setYearState={setYearState}
        monthState={monthState}
        setMonthState={setMonthState}
        selectDate={selectDate}
        setSelectDate={setSelectDate}
        monthlyEventList={monthlyEventList}
        setMonthlyEventList={setMonthlyEventList}
        setDailyScheduleList={setDailyScheduleList}
      />
      <CalendarSidebar
        yearState={yearState}
        monthState={monthState}
        selectDate={selectDate}
        dailyScheduleList={dailyScheduleList}
        setDailyScheduleList={setDailyScheduleList}
        setMonthlyEventList={setMonthlyEventList}
      />
    </main>
  );
}

function parseDate(year, month, day) {
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

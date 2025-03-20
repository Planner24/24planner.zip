import { useState } from 'react';
import CalendarContent from '../component/calendar/CalendarContent';
import CalendarSidebar from '../component/calendar/CalendarSidebar';

export default function Calendar() {
  const now = new Date();
  const [selectDate, setSelectDate] = useState(
    parseDate(now.getFullYear(), now.getMonth() + 1, now.getDate()),
  );

  // TODO: 테스트용 데이터이므로 API 연결 후 삭제 예정
  const scheduleList = [
    {
      color: '#69db7c',
      content: '1차 서류 제출 기간',
      startDate: '2025-02-27',
      endDate: '2025-03-04',
    },
    {
      color: '#4dabf7',
      content: '2차 서류 제출 기간',
      startDate: '2025-03-04',
      endDate: '2025-03-11',
    },
    {
      color: '#2f9e44',
      content: '집보기 15:00',
      startDate: '2025-03-06',
      endDate: '2025-03-07',
    },
    {
      color: '#fcc2d7',
      content: '일이삼사오육칠팔구십일이삼사오육칠팔',
      startDate: '2025-03-22',
      endDate: '2025-03-23',
    },
  ];

  const calendarMainStyle = 'flex justify-center h-full p-6';

  return (
    <main className={calendarMainStyle}>
      <CalendarContent setSelectDate={setSelectDate} scheduleList={scheduleList} />
      <CalendarSidebar selectDate={selectDate} scheduleList={scheduleList} />
    </main>
  );
}

function parseDate(year, month, day) {
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

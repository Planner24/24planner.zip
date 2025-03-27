import { useState } from 'react';
import CalendarContent from '../component/calendar/CalendarContent';
import CalendarSidebar from '../component/calendar/CalendarSidebar';

export default function Calendar() {
  const now = new Date();
  const [selectMonth, setSelectMonth] = useState(parseMonth(now.getFullYear(), now.getMonth() + 1));
  const [selectDate, setSelectDate] = useState(
    parseDate(now.getFullYear(), now.getMonth() + 1, now.getDate()),
  );
  const [eventList, setEventList] = useState([]);

  const calendarMainStyle = 'flex justify-center h-full px-2 pb-4';

  return (
    <main className={calendarMainStyle}>
      <CalendarContent
        selectMonth={selectMonth}
        setSelectMonth={setSelectMonth}
        selectDate={selectDate}
        setSelectDate={setSelectDate}
        scheduleList={scheduleList}
        eventList={eventList}
        setEventList={setEventList}
      />
      <CalendarSidebar selectDate={selectDate} scheduleList={scheduleList} />
    </main>
  );
}

function parseMonth(year, month) {
  return `${year}-${month.toString().padStart(2, '0')}`;
}

function parseDate(year, month, day) {
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

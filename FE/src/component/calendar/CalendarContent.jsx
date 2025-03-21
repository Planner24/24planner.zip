import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';

import CalendarModal from './CalendarModal';
import CalendarPopover from './CalendarPopover';
import ChevronLeftSvg from './svg/ChevronLeftSvg';
import ChevronRightSvg from './svg/ChevronRightSvg';

// TODO: 일정에 대한 Popover 기능 추가 예정
export default function CalendarContent({ setSelectDate, scheduleList }) {
  const calendarRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [yearState, setYearState] = useState(0);
  const [monthState, setMonthState] = useState(0);
  const [pointerPosition, setPointerPosition] = useState({ x: -1, y: -1 });

  const moveToCurrentMonth = () => {
    calendarRef.current.getApi().gotoDate(new Date());
  };

  const moveToPrevMonth = () => {
    const targetYear = yearState - (monthState === 1);
    const targetMonth = ((monthState + 10) % 12) + 1;
    setYearState(targetYear);
    setMonthState(targetMonth);
    calendarRef.current.getApi().gotoDate(parseDate(targetYear, targetMonth, 1));
  };

  const moveToNextMonth = () => {
    const targetYear = yearState + (monthState === 12);
    const targetMonth = (monthState % 12) + 1;
    setYearState(targetYear);
    setMonthState(targetMonth);
    calendarRef.current.getApi().gotoDate(parseDate(targetYear, targetMonth, 1));
  };

  const handleDateCellClick = (e) => {
    console.log(e.dateStr);
    setSelectDate(() => e.dateStr);
  };

  const handleCalendarModal = () => {
    setShowModal(() => true);
  };

  const eventList = scheduleList.map((schedule) => {
    return {
      title: schedule.content,
      start: schedule.startDate,
      end: schedule.endDate,
      backgroundColor: schedule.color,
      borderColor: '#FFFFFF',
    };
  });

  const calendarContentStyle = 'flex flex-col flex-2 h-full w-full border-r-1 border-gray-300 my-4';
  const buttonStyle =
    'w-20 h-10 bg-white border-2 border-primary rounded-xl text-primary text-lg font-semibold cursor-pointer hover:bg-primary hover:text-white ml-2';

  return (
    <>
      {showModal &&
        createPortal(<CalendarModal modalClose={() => setShowModal(false)} />, document.body)}
      {pointerPosition.x >= 0 ? (
        createPortal(
          <CalendarPopover
            pointerPosition={pointerPosition}
            setPointerPosition={setPointerPosition}
          />,
          document.body,
        )
      ) : (
        <></>
      )}
      <section className={calendarContentStyle}>
        <div className="px-8">
          <div className="w-full">
            <section className="pt-4 flex justify-between">
              {/* 중앙 정렬용 태그 */}
              <nav className="flex flex-1 justify-start" />
              <nav className="flex flex-2 justify-center items-center">
                <div className="flex flex-1 justify-end">
                  <div className="cursor-pointer" onClick={moveToPrevMonth}>
                    <ChevronLeftSvg />
                  </div>
                </div>
                <div className="mx-5 flex flex-3 justify-center">
                  <h2 className="text-3xl">
                    {yearState}년 {monthState}월
                  </h2>
                </div>
                <div className="flex flex-1 justify-start" onClick={moveToNextMonth}>
                  <div className="cursor-pointer" onClick={moveToNextMonth}>
                    <ChevronRightSvg />
                  </div>
                </div>
              </nav>
              <nav className="flex flex-1 justify-end">
                <button className={buttonStyle} onClick={moveToCurrentMonth}>
                  오늘
                </button>
                <button className={buttonStyle} onClick={handleCalendarModal}>
                  추가
                </button>
              </nav>
            </section>
          </div>
          {/* TODO: 현재 브라우저 세로 길이가 작으면 달력이 Footer까지 넘어오는 문제 존재 */}
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            showNonCurrentDates={false}
            locale={koLocale}
            dateClick={handleDateCellClick}
            events={eventList}
            dayCellContent={(arg) => ({
              // 한국어 사용 시, 일수가 기본적으로 "n일" 형태로 표현되므로 직접 숫자만 출력
              html: `${arg.date.getDate()}`,
            })}
            // 스타일 수정을 위해 헤더를 외부에서 정의했으므로, 월을 바꿀 때마다 해당 년도와 월을 state에 지정해야 표시됨
            datesSet={(dateInfo) => {
              setYearState(() => dateInfo.start.getFullYear());
              setMonthState(() => dateInfo.start.getMonth() + 1);
            }}
            // 달력 헤더 스타일 수정을 위해, 달력 기본 헤더를 비활성
            headerToolbar={{
              left: '',
              center: '',
              right: '',
            }}
          />
        </div>
      </section>
    </>
  );
}

function parseDate(year, month, day) {
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

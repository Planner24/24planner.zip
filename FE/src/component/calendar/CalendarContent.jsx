import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';

import CalendarModal from './CalendarModal';
import ChevronLeftSvg from './svg/ChevronLeftSvg';
import ChevronRightSvg from './svg/ChevronRightSvg';

import { eventMouseHoverReducer, eventMouseLeaveReducer } from '../../store/slices/popoverSlice';

export default function CalendarContent({ setSelectDate, scheduleList, eventList, setEventList }) {
  const dispatch = useDispatch();

  const calendarRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [yearState, setYearState] = useState(0);
  const [monthState, setMonthState] = useState(0);

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
    setSelectDate(() => e.dateStr);
  };

  const handleEventMouseEnter = (e) => {
    const endDate = new Date(e.event.end - 86400000);

    dispatch(
      eventMouseHoverReducer({
        title: e.event.title,
        start: e.event.startStr,
        end: parseDate(endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate()),
        color: e.event.backgroundColor,
      }),
    );
  };

  const handleEventMouseLeave = () => {
    dispatch(eventMouseLeaveReducer());
  };

  const handleCalendarModal = () => {
    setShowModal(() => true);
  };

  const calendarContentStyle = 'flex flex-col flex-2 h-full w-full border-r-1 border-gray-300 my-4';
  const calendarPaddingStyle = 'px-8';
  const calendarHeaderStyle = 'flex justify-between w-full pt-4';
  const calendarHeaderLeftStyle = 'flex flex-1 justify-start';
  const calendarHeaderCenterStyle = 'flex flex-2 justify-center items-center';
  const calendarHeaderRightStyle = 'flex flex-1 justify-end';
  const calendarHeaderCenterPrevDivStyle = 'flex flex-1 justify-end';
  const calendarHeaderCenterDateDivStyle = 'flex flex-3 justify-center mx-5';
  const calendarHeaderCenterDateTextStyle = 'text-3xl';
  const calendarHeaderCenterDivClickableStyle = 'cursor-pointer';
  const calendarHeaderCenterNextDivStyle = 'flex flex-1 justify-start';
  const buttonStyle =
    'w-20 h-10 bg-white border-2 border-primary rounded-xl text-primary text-lg font-semibold cursor-pointer hover:bg-primary hover:text-white ml-2';

  return (
    <>
      {showModal &&
        createPortal(<CalendarModal modalClose={() => setShowModal(false)} />, document.body)}
      <section className={calendarContentStyle}>
        <div className={calendarPaddingStyle}>
          <div className={calendarHeaderStyle}>
            {/* 헤더 중앙 정렬용 태그 */}
            <nav className={calendarHeaderLeftStyle} />
            <nav className={calendarHeaderCenterStyle}>
              <div className={calendarHeaderCenterPrevDivStyle}>
                <div className={calendarHeaderCenterDivClickableStyle} onClick={moveToPrevMonth}>
                  <ChevronLeftSvg />
                </div>
              </div>
              <div className={calendarHeaderCenterDateDivStyle}>
                <h2 className={calendarHeaderCenterDateTextStyle}>
                  {yearState}년 {monthState}월
                </h2>
              </div>
              <div className={calendarHeaderCenterNextDivStyle} onClick={moveToNextMonth}>
                <div className={calendarHeaderCenterDivClickableStyle} onClick={moveToNextMonth}>
                  <ChevronRightSvg />
                </div>
              </div>
            </nav>
            <nav className={calendarHeaderRightStyle}>
              <button className={buttonStyle} onClick={moveToCurrentMonth}>
                오늘
              </button>
              <button className={buttonStyle} onClick={handleCalendarModal}>
                추가
              </button>
            </nav>
          </div>
          {/* TODO: 현재 브라우저 세로 길이가 작으면 달력이 Footer까지 넘어오는 문제 존재 */}
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            showNonCurrentDates={false}
            locale={koLocale}
            events={eventList}
            eventMouseEnter={handleEventMouseEnter}
            eventMouseLeave={handleEventMouseLeave}
            dateClick={handleDateCellClick}
            dayCellContent={(arg) => ({
              // 한국어 사용 시, 일수가 기본적으로 "n일" 형태로 표현되므로 직접 숫자만 출력
              html: `${arg.date.getDate()}`,
            })}
            datesSet={(dateInfo) => {
              const nowYear = dateInfo.start.getFullYear();
              const nowMonth = dateInfo.start.getMonth() + 1;
              const startDate = dateInfo.start.getDate();
              const endDate = new Date(dateInfo.end - 86400000).getDate();

              // 스타일 수정을 위해 헤더를 외부에서 정의했으므로, 월을 바꿀 때마다 해당 년도와 월을 state에 지정해야 표시됨
              setYearState(() => nowYear);
              setMonthState(() => nowMonth);

              const startInt = nowYear * 10000 + nowMonth * 100 + startDate;
              const endInt = startInt - startDate + endDate;

              // 월 단위로 스케줄 가져오기
              const newEventList = [];
              scheduleList.forEach((schedule) => {
                const scheduleStartInt = parseIntFromDate(schedule.startDate);
                const scheduleEndInt = parseIntFromDate(schedule.endDate);
                if (scheduleEndInt >= startInt && scheduleStartInt <= endInt) {
                  // 달력에 일정을 출력하기 위해서는 종료일을 하루 뒤로 변경해야 함
                  const nextDayOfEndDate = new Date(new Date(schedule.endDate) - 1 + 86400001);
                  // color가 아니라 backgroundColor와 borderColor를 각각 지정해야 일정 간 간격을 띄울 수 있음
                  newEventList.push({
                    title: schedule.content,
                    start: schedule.startDate,
                    end: parseDate(
                      nextDayOfEndDate.getFullYear(),
                      nextDayOfEndDate.getMonth() + 1,
                      nextDayOfEndDate.getDate(),
                    ),
                    backgroundColor: schedule.color,
                    borderColor: '#FFFFFF',
                  });
                }
              });

              setEventList(() => newEventList);
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

function parseIntFromDate(date) {
  return (
    Number.parseInt(date.substring(0, 4)) * 10000 +
    Number.parseInt(date.substring(5, 7)) * 100 +
    Number.parseInt(date.substring(8, 10))
  );
}

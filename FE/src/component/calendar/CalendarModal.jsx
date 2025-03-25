import { useState, forwardRef } from 'react';
import { createPortal } from 'react-dom';

import DatePicker, { registerLocale } from 'react-datepicker';
import ko from 'date-fns/locale/ko';

import 'react-datepicker/dist/react-datepicker.css';

import CalendarColorModal from './CalendarColorModal';

export default function CalendarModal({ modalClose }) {
  const [showModal2, setShowModal2] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // DatePicker에 요일이 한국어로 뜨도록 할 때 필요한 설정
  registerLocale('ko', ko);

  const years = [];
  for (let i = 1970; i < 2100; i++) {
    years.push(i);
  }

  const months = [];
  for (let i = 1; i < 13; i++) {
    months.push(i);
  }

  const createCustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => {
    return (
      <div className="flex justify-evenly text-lg">
        <button className="text-base" onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
          {'<'}
        </button>
        <div>
          <select
            className="appearance-none focus:outline-none"
            value={date.getFullYear()}
            onChange={({ target: { value } }) => changeYear(value)}
          >
            {years.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          년&nbsp;
          <select
            className="appearance-none focus:outline-none text-right"
            value={months[date.getMonth()]}
            onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
          >
            {months.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          월&nbsp;
        </div>
        <button className="text-base" onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
          {'>'}
        </button>
      </div>
    );
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClickColor = () => {
    setShowModal2(() => true);
  };

  const handleButton = (e) => {
    alert('확인');
    e.preventDefault();
    e.stopPropagation();
    modalClose();
  };

  const StartDateCustomInput = buttonForDackPicker();
  const EndDateCustomInput = buttonForDackPicker();

  const transparentBlackBackgroundStyle =
    'absolute flex top-0 left-0 z-2 w-full h-full min-w-320 min-h-220 bg-black/75';
  const flexColStyle = 'flex flex-col justify-center items-center mx-auto my-auto';
  const sizeLimiterStyle = flexColStyle + ' w-full h-full max-w-320 max-h-220 bg-transparent';
  const modalBodyStyle = flexColStyle + ' w-2/3 h-2/3 bg-white rounded-3xl border-2 border-primary';
  const formStyle = 'flex flex-col justify-between items-center mx-auto my-auto h-1/2 w-2/3';
  const inputLineStyle =
    'flex justify-between items-center w-full border-b-1 border-gray-500 text-xl p-1 m-4';
  const inputWrapperStyle = 'flex grow';
  const inputStyle = 'grow focus:outline-hidden';
  const circleStyle = 'bg-primary w-10 h-10 rounded-4xl';
  const dateSelectWrapperStyle = 'flex w-full h-2/5 justify-between';
  const dateSelectStyle = 'flex flex-1 flex-col justify-evenly items-center';
  const dateSelectTitleStyle = 'text-2xl';
  const dateSelectContentStyle = 'text-lg';
  const buttonStyle =
    'w-40 h-15 bg-white border-4 border-primary rounded-3xl text-primary text-xl font-bold cursor-pointer hover:bg-primary hover:text-white';

  return (
    <div className={transparentBlackBackgroundStyle} onClick={modalClose}>
      {showModal2 &&
        createPortal(
          <CalendarColorModal modalClose2={() => setShowModal2(() => false)} />,
          document.body,
        )}
      <div className={sizeLimiterStyle}>
        <div
          className={modalBodyStyle}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <form className={formStyle} onSubmit={handleFormSubmit}>
            <div className={inputLineStyle}>
              <div className={inputWrapperStyle}>
                <input type="text" className={inputStyle} placeholder="할 일 입력"></input>
              </div>
              <div>
                <div className={circleStyle} onClick={handleClickColor} />
              </div>
            </div>
            <div className={dateSelectWrapperStyle}>
              <div className={dateSelectStyle}>
                <div className={dateSelectTitleStyle}>시작일</div>
                <div className={dateSelectContentStyle}>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => {
                      setStartDate(date);
                      if (endDate < date) {
                        setEndDate(date);
                      }
                    }}
                    customInput={<StartDateCustomInput />}
                    locale="ko"
                    renderCustomHeader={createCustomHeader}
                  />
                </div>
              </div>
              <div className={dateSelectStyle}>
                <div className={dateSelectTitleStyle}>종료일</div>
                <div className={dateSelectContentStyle}>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => {
                      setEndDate(date);
                      if (startDate > date) {
                        setStartDate(date);
                      }
                    }}
                    customInput={<EndDateCustomInput />}
                    locale="ko"
                    renderCustomHeader={createCustomHeader}
                  />
                </div>
              </div>
            </div>
            <div>
              <button className={buttonStyle} onClick={handleButton}>
                할 일 추가하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function buttonForDackPicker() {
  return forwardRef(({ value, onClick, className }, ref) => (
    <button className={className} onClick={onClick} ref={ref}>
      {value.substring(6, 10)}년 {value.substring(0, 2)}월 {value.substring(3, 5)}일
    </button>
  ));
}

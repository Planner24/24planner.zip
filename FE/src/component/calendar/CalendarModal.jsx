import { useState, forwardRef } from 'react';

import DatePicker, { registerLocale } from 'react-datepicker';
import ko from 'date-fns/locale/ko';

import 'react-datepicker/dist/react-datepicker.css';

import CalendarColorModal from './CalendarColorModal';

export default function CalendarModal({ modalClose }) {
  const [selectColor, setSelectColor] = useState('#69DB7C');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showColorDropdown, setShowColorDropdown] = useState(false);

  // DatePicker에 요일이 한국어로 뜨도록 할 때 필요한 설정
  registerLocale('ko', ko);

  const datePickerHeaderStyle = 'flex justify-between items-center text-lg mb-1';
  const datePickerButtonDivStyle = 'flex-1';
  const datePickerButtonStyle = 'text-base';
  const datePickerDateStyle = 'flex flex-2 justify-center';

  const createCustomHeader = ({ date, decreaseMonth, increaseMonth }) => {
    return (
      <div className={datePickerHeaderStyle}>
        <div className={datePickerButtonDivStyle}>
          <button className={datePickerButtonStyle} onClick={decreaseMonth}>
            {'<'}
          </button>
        </div>
        <div className={datePickerDateStyle}>
          {date.getFullYear()}년 {date.getMonth() + 1}월
        </div>
        <div className={datePickerButtonDivStyle}>
          <button className={datePickerButtonStyle} onClick={increaseMonth}>
            {'>'}
          </button>
        </div>
      </div>
    );
  };

  const handleBackgroundClick = () => {
    if (showColorDropdown) {
      setShowColorDropdown(() => false);
    } else {
      modalClose();
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClickColor = () => {
    setShowColorDropdown((prev) => !prev);
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation();
  };

  const handleButton = (e) => {
    if (showColorDropdown) {
      setShowColorDropdown(() => false);
      e.preventDefault();
      e.stopPropagation();
    } else {
      alert('확인');
      e.preventDefault();
      e.stopPropagation();
      modalClose();
    }
  };

  const StartDateCustomInput = buttonForDatePicker();
  const EndDateCustomInput = buttonForDatePicker();

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
  const circleStyle = `bg-[${selectColor}] w-10 h-10 rounded-4xl`;
  const dateSelectWrapperStyle = 'flex w-full h-2/5 justify-between';
  const dateSelectStyle = 'flex flex-1 flex-col justify-evenly items-center';
  const dateSelectTitleStyle = 'text-2xl';
  const dateSelectContentStyle = 'text-lg';
  const buttonStyle =
    'w-40 h-15 bg-white border-4 border-primary rounded-3xl text-primary text-xl font-bold cursor-pointer hover:bg-primary hover:text-white';
  const calendarModalDropdownStyle = 'relative group';
  const calendarModalDropdownBodyStyle = `absolute text-xl text-center top-11 space-y-4 -left-45 right-0 w-100 py-4 bg-white border-1 border-primary rounded-2xl shadow-sm z-8 ${showColorDropdown ? 'opacity-100 visible' : 'opacity-0 invisible'}`;

  return (
    <div className={transparentBlackBackgroundStyle} onClick={handleBackgroundClick}>
      <div className={sizeLimiterStyle}>
        <div
          className={modalBodyStyle}
          onClick={(e) => {
            if (showColorDropdown) {
              setShowColorDropdown(() => false);
            }
            e.stopPropagation();
          }}
        >
          <form className={formStyle} onSubmit={handleFormSubmit}>
            <div className={inputLineStyle}>
              <div className={inputWrapperStyle}>
                <input type="text" className={inputStyle} placeholder="할 일 입력"></input>
              </div>
              <div className={calendarModalDropdownStyle}>
                <div className={circleStyle} onClick={handleClickColor}>
                  <div className={calendarModalDropdownBodyStyle} onClick={handleDropdownClick}>
                    <CalendarColorModal selectColor={selectColor} setSelectColor={setSelectColor} />
                  </div>
                </div>
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

function buttonForDatePicker() {
  return forwardRef(({ value, onClick, className }, ref) => (
    <button className={className} onClick={onClick} ref={ref}>
      {value.substring(6, 10)}년 {value.substring(0, 2)}월 {value.substring(3, 5)}일
    </button>
  ));
}

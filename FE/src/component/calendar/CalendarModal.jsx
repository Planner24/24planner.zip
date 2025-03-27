import { useState } from 'react';
import { useParams } from 'react-router-dom';

import CalendarColorModal from './CalendarColorModal';
import CalendarModalDatePicker from './CalendarModalDatePicker';
import scheduleApi from '../../api/scheduleApi';

export default function CalendarModal({ modalClose }) {
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [color, setColor] = useState('#69DB7C');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showColorDropdown, setShowColorDropdown] = useState(false);

  const { movingPlanId } = useParams();

  const handleBackgroundClick = () => {
    if (showColorDropdown) {
      setShowColorDropdown(() => false);
    } else {
      modalClose();
    }
  };

  const handleModalBodyClick = (e) => {
    if (showColorDropdown) {
      setShowColorDropdown(() => false);
    }
    e.stopPropagation();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleContentChange = (e) => {
    setContent(() => e.target.value.substring(0, 20));
    setErrorMessage(() => null);
  };

  const handleClickColor = () => {
    setShowColorDropdown((prev) => !prev);
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation();
  };

  const handleButton = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (showColorDropdown) {
      setShowColorDropdown(() => false);
    } else {
      if (!content.length) {
        setErrorMessage(() => '내용은 필수로 입력해야 합니다.');
      } else {
        try {
          const response = await scheduleApi.createSchedule(movingPlanId, {
            content: content,
            startDate: parseDateObject(startDate),
            endDate: parseDateObject(endDate),
            color: color,
          });
          modalClose();
        } catch (err) {
          setErrorMessage(() => '등록 도중 오류가 발생했습니다.');
          console.log(err);
        }
      }
    }
  };

  const transparentBlackBackgroundStyle =
    'absolute flex top-0 left-0 z-2 w-full h-full min-w-320 min-h-220 bg-black/75';
  const flexColStyle = 'flex flex-col justify-center items-center mx-auto my-auto';
  const sizeLimiterStyle = flexColStyle + ' w-full h-full max-w-320 max-h-220 bg-transparent';
  const modalBodyStyle = flexColStyle + ' w-2/3 h-2/3 bg-white rounded-3xl border-2 border-primary';
  const formStyle = 'flex flex-col justify-between items-center mx-auto my-auto h-1/2 w-2/3';
  const inputLineStyle =
    'flex justify-between items-center w-full border-b-1 border-gray-500 text-xl p-1 m-3';
  const inputWrapperStyle = 'flex grow';
  const inputStyle = 'grow focus:outline-hidden';
  const circleStyle = `bg-[${color}] w-10 h-10 rounded-4xl`;
  const errorDivStyle = 'text-red-300';
  const buttonStyle =
    'w-40 h-15 bg-white border-4 border-primary rounded-3xl text-primary text-xl font-bold cursor-pointer hover:bg-primary hover:text-white';
  const calendarModalDropdownStyle = 'relative group';
  const calendarModalDropdownBodyStyle = `absolute text-xl text-center top-11 space-y-4 -left-45 right-0 w-100 py-4 bg-white border-1 border-primary rounded-2xl shadow-sm z-8 ${showColorDropdown ? 'opacity-100 visible' : 'opacity-0 invisible'}`;

  return (
    <div className={transparentBlackBackgroundStyle} onClick={handleBackgroundClick}>
      <div className={sizeLimiterStyle}>
        <div className={modalBodyStyle} onClick={handleModalBodyClick}>
          <form className={formStyle} onSubmit={handleFormSubmit}>
            <div className={inputLineStyle}>
              <div className={inputWrapperStyle}>
                <input
                  type="text"
                  className={inputStyle}
                  placeholder="할 일 입력"
                  value={content}
                  onChange={handleContentChange}
                />
              </div>
              <div className={calendarModalDropdownStyle}>
                <div className={circleStyle} onClick={handleClickColor}>
                  <div className={calendarModalDropdownBodyStyle} onClick={handleDropdownClick}>
                    <CalendarColorModal color={color} setColor={setColor} />
                  </div>
                </div>
              </div>
            </div>
            <div className={errorDivStyle}>{errorMessage ? errorMessage : '\u00A0'}</div>
            <CalendarModalDatePicker
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
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

function parseDateObject(date) {
  return parseDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

function parseDate(year, month, day) {
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

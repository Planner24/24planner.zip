export default function CalendarModal({ modalClose }) {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleButton = (e) => {
    alert('확인');
    e.preventDefault();
    e.stopPropagation();
    modalClose();
  };

  const transparentBlackBackgroundStyle =
    'absolute flex top-0 left-0 z-2 w-full h-full min-w-320 min-h-220 bg-black/75';
  const flexColStyle = 'flex flex-col justify-center items-center mx-auto my-auto';
  const sizeLimiterStyle = flexColStyle + ' w-full h-full max-w-320 max-h-220 bg-transparent';
  const modalBodyStyle = flexColStyle + ' w-3/4 h-3/4 bg-white rounded-3xl border-2 border-primary';
  const formStyle = 'flex flex-col justify-between items-center mx-auto my-auto h-2/3 w-3/4';
  const inputLineStyle =
    'flex justify-between items-center w-full border-b-1 border-gray-500 text-3xl p-1 m-4';
  const inputWrapperStyle = 'flex grow';
  const inputStyle = 'grow focus:outline-hidden';
  const circleStyle = 'bg-primary w-10 h-10 rounded-4xl';
  const dateSelectWrapperStyle = 'flex w-full h-2/5 justify-between';
  const dateSelectStyle = 'flex flex-1 flex-col justify-evenly items-center';
  const dateSelectTitleStyle = 'text-3xl';
  const dateSelectContentStyle = 'text-2xl';
  const buttonStyle =
    'w-60 h-20 bg-white border-4 border-primary rounded-3xl text-primary text-3xl font-bold cursor-pointer hover:bg-primary hover:text-white';

  return (
    <div className={transparentBlackBackgroundStyle} onClick={modalClose}>
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
                <div className={circleStyle}></div>
              </div>
            </div>
            <div className={dateSelectWrapperStyle}>
              <div className={dateSelectStyle}>
                <div className={dateSelectTitleStyle}>시작일</div>
                <div className={dateSelectContentStyle}>2025년 3월 25일</div>
              </div>
              <div className={dateSelectStyle}>
                <div className={dateSelectTitleStyle}>종료일</div>
                <div className={dateSelectContentStyle}>2025년 3월 26일</div>
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

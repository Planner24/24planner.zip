import React from 'react';

export default function CalendarColorModal({ modalClose2 }) {
  const handleBackgroundClick = (e) => {
    modalClose2();
    e.stopPropagation();
  };
  const transparentBackgroundStyle =
    'absolute flex top-0 left-0 z-4 w-full h-full min-w-320 min-h-220 bg-transparent';
  const flexColStyle = 'flex flex-col justify-center items-center mx-auto my-auto';
  const sizeLimiterStyle = flexColStyle + ' w-full h-full max-w-320 max-h-220 bg-transparent';
  const modalBodyStyle = flexColStyle + ' w-1/2 h-1/2 bg-white rounded-3xl border-2 border-primary';

  return (
    <div className={transparentBackgroundStyle} onClick={handleBackgroundClick}>
      <div className={sizeLimiterStyle}>
        <div
          className={modalBodyStyle}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          색상표
        </div>
      </div>
    </div>
  );
}

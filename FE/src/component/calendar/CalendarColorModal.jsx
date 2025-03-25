import React from 'react';

export default function CalendarColorModal({ modalClose2 }) {
  // Tailwind CSS에서 사용할 수 있도록 바탕 색상을 미리 정의하는 부분으로, 실제 대입하지는 않음
  const colorsListForSelect = [
    [
      ['bg-[#FFC9C9]', 'bg-[#FF8787]', 'bg-[#FA5252]', 'bg-[#E03131]'],
      ['bg-[#FFD8A8]', 'bg-[#FFA94D]', 'bg-[#FD7E14]', 'bg-[#E8590C]'],
      ['bg-[#FFEC99]', 'bg-[#FFD43B]', 'bg-[#FAB005]', 'bg-[#F08C00]'],
      ['bg-[#96F2D7]', 'bg-[#38D9A9]', 'bg-[#12B886]', 'bg-[#099268]'],
      ['bg-[#B2F2BB]', 'bg-[#69DB7C]', 'bg-[#40C057]', 'bg-[#2F9E44]'],
    ],
    [
      ['bg-[#A5D8FF]', 'bg-[#4DABF7]', 'bg-[#228BE6]', 'bg-[#1971C2]'],
      ['bg-[#D0BFFF]', 'bg-[#9775FA]', 'bg-[#7950F2]', 'bg-[#6741D9]'],
      ['bg-[#EEBEFA]', 'bg-[#DA77F2]', 'bg-[#BE4BDB]', 'bg-[#9C36B5]'],
      ['bg-[#EADDD7]', 'bg-[#D2BAB0]', 'bg-[#A18072]', 'bg-[#846358]'],
      ['bg-[#E9ECEF]', 'bg-[#CED4DA]', 'bg-[#868E96]', 'bg-[#343A40]'],
    ],
  ];

  const colorsList = [
    [
      ['#FFC9C9', '#FF8787', '#FA5252', '#E03131'],
      ['#FFD8A8', '#FFA94D', '#FD7E14', '#E8590C'],
      ['#FFEC99', '#FFD43B', '#FAB005', '#F08C00'],
      ['#96F2D7', '#38D9A9', '#12B886', '#099268'],
      ['#B2F2BB', '#69DB7C', '#40C057', '#2F9E44'],
    ],
    [
      ['#A5D8FF', '#4DABF7', '#228BE6', '#1971C2'],
      ['#D0BFFF', '#9775FA', '#7950F2', '#6741D9'],
      ['#EEBEFA', '#DA77F2', '#BE4BDB', '#9C36B5'],
      ['#EADDD7', '#D2BAB0', '#A18072', '#846358'],
      ['#E9ECEF', '#CED4DA', '#868E96', '#343A40'],
    ],
  ];

  const colorsDivList = colorsList.map((subColorsList, i) => {
    const subColorsDivList = subColorsList.map((colors, j) => {
      const colorDivList = colors.map((color, k) => {
        return (
          <div
            key={k}
            className={`w-10 h-10 m-1 border-1 border-gray-300 rounded-4xl bg-[${color}]`}
          />
        );
      });
      return (
        <div key={j} className="flex justify-center items-center">
          {colorDivList}
        </div>
      );
    });
    return (
      <div key={i} className="flex flex-1 flex-col justify-center items-center">
        {subColorsDivList}
      </div>
    );
  });

  const handleBackgroundClick = (e) => {
    modalClose2();
    e.stopPropagation();
  };

  const transparentBackgroundStyle =
    'absolute flex top-0 left-0 z-4 w-full h-full min-w-320 min-h-220 bg-transparent';
  const flexColStyle = 'flex flex-col justify-center items-center mx-auto my-auto';
  const sizeLimiterStyle = flexColStyle + ' w-full h-full max-w-320 max-h-220 bg-transparent';
  const modalBodyStyle = flexColStyle + ' w-1/2 h-1/2 bg-white rounded-3xl border-2';

  return (
    <div className={transparentBackgroundStyle} onClick={handleBackgroundClick}>
      <div className={sizeLimiterStyle}>
        <div
          className={modalBodyStyle}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex justify-center items-center">{colorsDivList}</div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { createPortal } from 'react-dom';
import PopoverComponent from './PopoverComponent';

export default function PopoverUtilComponent({ children }) {
  const [pointerPosition, setPointerPosition] = useState({ x: -1, y: -1 });
  const [popoverText, setPopoverText] = useState('');

  const handleMainMouseMove = (e) => {
    setPointerPosition(() =>
      e.target.className === 'fc-event-title-container' ||
      e.target.className === 'fc-event-title fc-sticky'
        ? { x: e.clientX, y: e.clientY }
        : { x: -1, y: -1 },
    );
    setPopoverText(() =>
      e.target.className === 'fc-event-title-container' ||
      e.target.className === 'fc-event-title fc-sticky'
        ? e.target.innerText
        : '',
    );
  };

  return (
    <>
      {pointerPosition.x >= 0 &&
        createPortal(
          <PopoverComponent pointerPosition={pointerPosition} popoverText={popoverText} />,
          document.body,
        )}
      <div className="flex flex-col items-center h-full w-full" onMouseMove={handleMainMouseMove}>
        {children}
      </div>
    </>
  );
}

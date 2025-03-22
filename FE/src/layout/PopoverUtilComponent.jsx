import { useState } from 'react';
import { createPortal } from 'react-dom';
import PopoverComponent from './PopoverComponent';

export default function PopoverUtilComponent({ children }) {
  const [pointerPosition, setPointerPosition] = useState({ x: -1, y: -1 });
  const [popoverText, setPopoverText] = useState('');

  const handleMainMouseMove = (e) => {
    setPointerPosition(() =>
      isTargetEventLine(e) ? { x: e.clientX, y: e.clientY } : { x: -1, y: -1 },
    );
    setPopoverText(() => (isTargetEventLine(e) ? e.target.innerText : ''));
  };

  const popoverUtilComponentStyle = 'flex flex-col items-center h-full w-full';

  return (
    <>
      {pointerPosition.x >= 0 &&
        createPortal(
          <PopoverComponent
            pointerPosition={pointerPosition}
            popoverText={popoverText}
            setPointerPosition={setPointerPosition}
          />,
          document.body,
        )}
      <div className={popoverUtilComponentStyle} onMouseMove={handleMainMouseMove}>
        {children}
      </div>
    </>
  );
}

function isTargetEventLine(e) {
  return (
    e.target.className === 'fc-event-title-container' ||
    e.target.className === 'fc-event-title fc-sticky'
  );
}

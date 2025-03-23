import { useSelector, useDispatch } from 'react-redux';
import { mouseMoveReducer } from '../store/slices/popoverSlice';

export default function PopoverComponent() {
  const dispatch = useDispatch();
  const pointerPositionX = useSelector((state) => state.popover.x);
  const pointerPositionY = useSelector((state) => state.popover.y);
  const popoverTitle = useSelector((state) => state.popover.popoverTitle);
  const popoverStartDate = useSelector((state) => state.popover.popoverStartDate);
  const popoverEndDate = useSelector((state) => state.popover.popoverEndDate);

  const handlePopoverHover = () => {
    dispatch(mouseMoveReducer({ x: -1, y: -1 }));
  };

  return (
    <div
      style={{
        left: pointerPositionX + 'px',
        top: pointerPositionY + 20 + 'px',
      }}
      className="w-fit h-fit absolute bg-red-500 z-10"
      onMouseMove={handlePopoverHover}
    >
      <div>{popoverTitle}</div>
      <div>{popoverStartDate}</div>
      <div>{popoverEndDate}</div>
    </div>
  );
}

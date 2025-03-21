export default function PopoverComponent({ pointerPosition, setPointerPosition }) {
  return (
    <div
      style={{
        left: pointerPosition.x + 'px',
        top: pointerPosition.y + 20 + 'px',
      }}
      className="w-10 h-10 absolute bg-red-500 z-10"
      onMouseOver={() => setPointerPosition(() => ({ x: -1, y: -1 }))}
    >
      CalendarPopover
    </div>
  );
}

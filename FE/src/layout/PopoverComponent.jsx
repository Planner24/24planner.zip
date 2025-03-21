export default function PopoverComponent({ pointerPosition, popoverText }) {
  return (
    <div
      style={{
        left: pointerPosition.x + 'px',
        top: pointerPosition.y + 20 + 'px',
      }}
      className="w-fit h-fit absolute bg-red-500 z-10"
    >
      {popoverText}
    </div>
  );
}

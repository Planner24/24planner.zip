export default function PopoverUtilComponent({ setPointerPosition }) {
  const handleMouseMove = (e) => {
    console.log(e.target.className);
    setPointerPosition(() =>
      e.target.className === 'fc-event-title-container' ||
      e.target.className === 'fc-event-title fc-sticky'
        ? { x: e.clientX, y: e.clientY }
        : { x: -1, y: -1 },
    );
  };

  const transparentBackgroundStyle =
    'absolute flex top-0 left-0 z-0 w-full h-full min-w-320 min-h-180 bg-transparent';
  return <div className={transparentBackgroundStyle} onMouseMove={handleMouseMove} />;
}

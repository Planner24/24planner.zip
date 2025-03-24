export default function TaskGroupMemo() {
  // CSS
  const memoWrapperStyle = 'w-full';
  const memoStyle =
    'w-full min-h-100 border rounded-3xl border-primary border-2 p-18 px-18 py-13 resize-none focus:outline-none';

  return (
    <section className={memoWrapperStyle}>
      <textarea
        name="memo"
        id="memo"
        placeholder="메모를 입력하세요."
        className={memoStyle}
      ></textarea>
    </section>
  );
}

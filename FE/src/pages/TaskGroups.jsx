import TaskGroupBox from '../component/TaskGroup/TaskGroupBox';

export default function TaskGroups() {
  // CSS
  // px: 가로padding py: 세로 패딩
  // w-25: width: 25px * 4
  //
  const section = 'px-15 py-3.75 flex flex-col items-center';
  const totalGaugeFontSize = 'font-roboto text-xl font-bold';
  const gauge = 'w-200 h-10 border-2 rounded-full m-5 px-2 py-1 border-primary bg-primary';
  const house =
    'w-200 border-2 rounded-3xl m-5 px-2 py-5  border-4 border-primary text-lg text-black text-center font-bold bg-white font-roboto';
  const totalGuageTextContainer = 'text-center';

  return (
    <section className={`${section}`}>
      <div>
        <span className={`${totalGaugeFontSize}`}>이사</span>
        <span className={`${totalGaugeFontSize} text-primary`}> 00%</span>
        <span className={`${totalGaugeFontSize}`}> 완료!</span>
      </div>
      <div className={`${gauge}`}></div>
      <div className={`${house}`}>살 곳 정하기</div>

      <TaskGroupBox></TaskGroupBox>
    </section>
  );
}

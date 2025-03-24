import authApi from '../api/authApi';

export default function PlanList() {
  const displayStyle = 'px-3 py-10 flex flex-col items-center gap-10 text-center';
  const planHeader = 'w-full';
  const titleStyle = 'text-2xl';
  const lineStyle = 'w-9/10 mx-auto mt-5 border-t-2 border-primary';
  const planDiv = 'px-30';

  return (
    <div className={displayStyle}>
      <div className={planHeader}>
        <h2 className={titleStyle}>이사 목록</h2>
        <hr className={lineStyle} />
      </div>
      <div className={planDiv}></div>
    </div>
  );
}

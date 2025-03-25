import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import planApi from '../api/planApi';

export default function PlanSetting() {
  const { movingPlanId } = useParams();

  // 상태 관리 데이터
  const [plan, setPlan] = useState();

  // 이사 플랜 조회
  useEffect(() => {
    async function fetchPlan() {
      try {
        const response = await planApi.readPlan(movingPlanId);
        const data = response.data.data;

        setPlan(data);
      } catch (error) {}
    }
    fetchPlan();
  });

  // CSS
  const displayStyle = 'w-300 mx-auto my-5 text-center';
  const titleHeader = 'h-full mx-60 flex justify-between';
  const titleDiv = 'flex';
  const titleStyle = 'text-2xl mr-5';
  const titleButton =
    'text-xl text-gray-500 text-opacity-70 underline cursor-pointer hover:text-primary';

  return (
    <div className={displayStyle}>
      <div className={titleHeader}>
        <div className={titleDiv}>
          <h2 className={titleStyle}>{plan?.title}</h2>
          <button className={titleButton}>수정</button>
        </div>
        <button className={titleButton}>이사 플랜 삭제</button>
      </div>
    </div>
  );
}

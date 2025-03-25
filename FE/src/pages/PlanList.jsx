import { useEffect, useState } from 'react';
import planApi from '../api/planApi';
import Plan from '../component/plan/Plan';

export default function PlanList() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await planApi.readPlans();
        const data = response.data.data;
        console.log(data.movingPlans);
        setPlans(data.movingPlans);
      } catch (error) {}
    }
    fetchPlans();
  }, []);

  // CSS
  const displayStyle = 'px-3 py-10 flex flex-col items-center gap-10 text-center';
  const planHeader = 'w-full';
  const titleStyle = 'text-2xl';
  const lineStyle = 'w-9/10 mx-auto mt-5 border-t-2 border-primary';
  const planDiv = 'w-full px-60 py-10 list-none';

  return (
    <div className={displayStyle}>
      <div className={planHeader}>
        <h2 className={titleStyle}>이사 목록</h2>
        <hr className={lineStyle} />
      </div>
      <ul className={planDiv}>
        {plans.map((plan) => (
          <Plan plan={plan} />
        ))}
      </ul>
    </div>
  );
}

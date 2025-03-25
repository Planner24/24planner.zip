import { Link } from 'react-router-dom';

export default function Plan({ plan }) {
  const { id, title } = plan;

  // CSS
  const planLi =
    'w-full flex items-center justify-between mb-10 px-5 py-5 border-2 border-primary rounded-3xl relative';
  const planText = 'w-full text-center text-2xl ';
  const settingLink = 'absolute right-5 text-xl cursor-pointer';

  return (
    <li className={planLi}>
      <div className={planText}>{title}</div>
      <Link to={`/plans/${id}/setting`} className={settingLink}>
        ⚙️
      </Link>
    </li>
  );
}

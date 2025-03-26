import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import authApi from '../../api/authApi';
import planApi from '../../api/planApi';

export default function HeaderRight() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [storedPlanId, setStoredPlanId] = useState(0);
  const [currentPlanTitle, setCurrentPlanTitle] = useState('');

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const splitedUrlString = location.pathname.split('/');
  let currentPlanId = splitedUrlString[2];
  currentPlanId = currentPlanId === undefined ? 0 : currentPlanId;

  if (currentPlanId != storedPlanId) {
    setStoredPlanId(currentPlanId);
  }

  useEffect(() => {
    async function setPlanTitle() {
      try {
        const response = await planApi.readPlan(storedPlanId);
        setCurrentPlanTitle(response.data.data.title);
      } catch (error) {
        console.log(error);
        setCurrentPlanTitle('');
      }
    }

    if (storedPlanId) {
      setPlanTitle();
    } else {
      setCurrentPlanTitle('');
    }
  }, [storedPlanId]);

  const handleLogoutClick = async () => {
    dispatch(logout());
    await authApi.logout();
    navigate('/');
  };

  const headerListStyle = 'flex flex-1 justify-end';
  const headerItemStyle = 'flex items-center p-4';
  const headerDropdownStyle = headerItemStyle + ' relative group min-w-30';
  const headerDropdownButtonStyle = 'w-full text-center text-secondary cursor-pointer';
  const headerDropdownBodyStyle =
    'absolute text-xl text-center top-15 space-y-4 left-0 right-0 w-full py-4 bg-gray-100 shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300';
  const headerDropdownItemStyle = 'w-full';
  const headerDropdownLinkStyle = 'block w-full';

  // dropdown 구현 참고: https://medium.com/internet-of-technology/in-2-minutes-how-to-make-a-tailwind-css-dropdown-menu-817320bb0678
  return (
    <ul className={headerListStyle}>
      {splitedUrlString[1] === 'plans' &&
      splitedUrlString[2] &&
      Number.parseInt(splitedUrlString[2]) > 0 ? (
        <li className={headerDropdownStyle}>
          <div className={headerDropdownButtonStyle}>{currentPlanTitle}</div>
          <ul className={headerDropdownBodyStyle}>
            <li className={headerDropdownItemStyle}>
              <Link to="/plans" className={headerDropdownLinkStyle}>
                이사 목록
              </Link>
            </li>
            <li className={headerDropdownItemStyle}>
              <Link
                to={`/plans/${splitedUrlString[2]}/setting`}
                className={headerDropdownLinkStyle}
              >
                이사 설정
              </Link>
            </li>
          </ul>
        </li>
      ) : (
        <></>
      )}

      {isLoggedIn && (
        <li className={headerItemStyle}>
          <div className="cursor-pointer" onClick={handleLogoutClick}>
            로그아웃
          </div>
        </li>
      )}
    </ul>
  );
}

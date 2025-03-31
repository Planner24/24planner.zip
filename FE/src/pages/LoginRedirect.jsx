import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/slices/authSlice';

export default function LoginRedirect() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLoginRedirect = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('token');
      const nickname = urlParams.get('nickname');

      if (!accessToken) {
        alert('로그인에 실패했습니다. 다시 시도해주세요.');
        navigate('/login', { replace: true });
        return;
      }

      dispatch(login(nickname, accessToken));
      setTimeout(() => {
        navigate('/plans', { replace: true });
      }, 0);
    };

    handleLoginRedirect();
  }, [navigate, dispatch]);

  return (
    <div>
      <p>로그인 중입니다.</p>
    </div>
  );
}

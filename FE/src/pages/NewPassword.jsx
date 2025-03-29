import React, { useEffect } from 'react';
import Password from '../component/user/Password';
import { useDispatch } from 'react-redux';
import { clearTempToken } from '../store/slices/authPwdSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function NewPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const query = search.get('query');
  useEffect(() => {
    const storedTokenData = localStorage.getItem('tempToken');
    if (storedTokenData) {
      const { value: tempToken, expiredAt } = JSON.parse(storedTokenData);

      const expireTime = new Date(expiredAt);
      const now = new Date();

      if (now >= expireTime) {
        dispatch(clearTempToken());
        navigate('/notFound');
      }
    } else {
      navigate('/notfound');
    }
  }, [dispatch]);

  const container = 'w-full grid content-center justify-items-center relative top-50';
  const image = 'w-64 mb-20 text-center cursor-pointer';

  return (
    <div className={`${container}`}>
      <img alt="이사모음집 로고" className={`${image}`} src="/src/logo.png"></img>

      <Password></Password>
    </div>
  );
}

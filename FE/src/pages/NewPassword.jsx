import React, { useEffect, useState } from 'react';
import Password from '../component/user/Password';
import { useDispatch } from 'react-redux';
import { clearTempToken } from '../store/slices/authPwdSlice';
import { useNavigate } from 'react-router-dom';

export default function NewPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const storedTokenData = localStorage.getItem('tempToken');
    if (storedTokenData) {
      const { value: tempToken, expiredAt } = JSON.parse(storedTokenData);

      const expireTime = new Date(expiredAt);
      const now = new Date();
      console.log('토큰 만료 시간:', expireTime);
      console.log('현재 시간:', now);

      if (now >= expireTime) {
        console.log('토큰 만료됨, 삭제 중...');
        localStorage.removeItem('tempToken');
        dispatch(clearTempToken);
        navigate('/notFound');
      }
    } else {
      navigate('/notfound');
    }
  }, [dispatch]);

  const container = 'relative';
  const image = 'w-64 text-center cursor-pointer absolute left-173 top-38';

  return (
    <div className={`${container}`}>
      <img alt="이사모음집 로고" className={`${image}`} src="/src/logo.png"></img>

      <Password></Password>
    </div>
  );
}

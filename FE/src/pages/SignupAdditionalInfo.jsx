import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';

export default function SignupAdditionalInfo() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // 상태 관리 데이터
  const [tempToken, setTempToken] = useState('');
  const [nickname, setNickname] = useState('');
  const [isSignupAvailable, setIsSignupAvailable] = useState(false);
  const [message, setMessage] = useState({
    color: '',
    content: '',
  });

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/plans');
      return;
    }
  }, [isLoggedIn]);

  // 입력값 검증
  const checkNickname = (value) => /^[가-힣a-zA-Z0-9]{2,17}$/.test(value);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('tempToken');
    setTempToken(token);
  }, [location]);

  // 회원가입
  const handleSubmit = async (e) => {
    try {
      const response = await authApi.completeSignup(nickname, tempToken);
      const data = response.data.data;

      dispatch(login(data.nickname, data.accessToken));
      alert(response.data.message);
      navigate('/plans', { replace: true });
    } catch (e) {
      alert('회원가입에 실패했습니다. 다시 로그인해주세요.');
      navigate('/login', { replace: true });
    }
  };

  // 닉네임 입력
  const handleInputNickname = (e) => {
    const value = e.target.value;

    if (!value) {
      setIsSignupAvailable(false);
      setMessage({ color: '', content: '' });
      setNickname('');
      return;
    }

    setNickname(e.target.value);
  };

  // 닉네임 유효성 검증
  const verifyNickname = async () => {
    if (!checkNickname(nickname)) {
      setMessage({ color: 'red-400', content: '특수문자 제외, 2자 이상 17자 이하여야 합니다.' });
      return;
    }

    try {
      const response = await authApi.verifyNickname(nickname);
      const data = response.data;

      setMessage({ color: 'primary', content: data.message });
      setIsSignupAvailable(true);
    } catch (error) {
      const errordata = error.response.data;

      if (errordata.code === 'EXIST_NICKNAME') {
        setMessage({ color: 'red-400', content: errordata.message });
      } else {
        setMessage({ color: 'red-400', content: '닉네임 중복 확인에 실패했습니다.' });
      }

      setIsSignupAvailable(false);
    }
  };

  // CSS
  const signupWrapperStyle = 'h-screen flex flex-col justify-center items-center gap-2';
  const inputButtonDiv = 'flex justify-center';
  const inputStyle = 'w-80 mx-1 px-2 focus:outline-none text-xl border-b border-gray-400';
  const able = 'border-primary text-primary hover:bg-primary hover:text-white cursor-pointer';
  const disable = 'border-gray-300 text-gray-300 hover:none';
  const buttonStyle = 'w-25 h-10 border-2 rounded-full px-2 py-1' + able;
  const signupButton = 'block mx-auto border-2 rounded-2xl px-8 py-2 mt-1 text-xl';
  const messageStyle = 'font-semibold';

  return (
    <div className={signupWrapperStyle}>
      <div className={inputButtonDiv}>
        <input
          type="text"
          id="nickname"
          name="nickname"
          value={nickname}
          placeholder="닉네임"
          className={inputStyle}
          onChange={handleInputNickname}
          required
        />
        <button
          className={buttonStyle}
          onMouseDown={(e) => e.preventDefault()}
          onClick={verifyNickname}
        >
          중복확인
        </button>
      </div>
      <div className={`${messageStyle} text-${message.color}`}>{message.content || '\u00A0'}</div>
      <button
        className={`${signupButton} ${isSignupAvailable ? able : disable}`}
        disabled={!isSignupAvailable}
        onClick={handleSubmit}
      >
        회원가입
      </button>
    </div>
  );
}

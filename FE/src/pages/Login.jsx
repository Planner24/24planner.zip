import { useNavigate } from 'react-router-dom';
import logo from '../../public/logo.png';
import { useState } from 'react';
import authApi from '../api/authApi';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // formData 상태 관리
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // 로고 클릭 시 메인 페이지로 이동
  const toHome = () => {
    navigate('/');
  };

  // 로그인 폼 제출 시 api 요청
  const handleSubmitLoginForm = async (e) => {
    e.preventDefault();

    try {
      const response = await authApi.login(formData);
      const data = response.data;

      // 로그인 시 accessToken을 localstorage에 저장
      const { accessToken } = data.data;
      dispatch(login({ accessToken }));

      navigate('/plans');
    } catch (error) {
      console.error('로그인 중 오류가 발생했습니다.');
    }
  };

  // 이메일주소, 비밀번호 입력 시 formData 값 변경
  const handleInput = (e) => {
    const key = e.target.name;
    const value = e.target.value;

    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // 회원가입 버튼 클릭 시 회원가입 페이지로 이동
  const handleClickSignupButton = () => {
    navigate('/signup');
  };

  // CSS
  const displayStyle = 'h-screen flex flex-col justify-center items-center';
  const logoStyle = 'w-64 text-center cursor-pointer';
  const loginWrapperStyle = 'w-full h-1/2 flex flex-col justify-center items-center';
  const loginFormStyle =
    'w-130 h-3/4 flex flex-col justify-between items-center box-border pt-15 pb-3';
  const inputWrapperStyle = 'w-full';
  const inputStyle = 'w-full text-xl pl-3 focus:outline-none focus:placeholder-transparent';
  const lineStyle = 'mt-3';
  const buttonStyle =
    'px-12 py-3 text-2xl text-primary cursor-pointer border-3 border-solid rounded-3xl border-primary hover:bg-primary hover:text-white';
  const signupRequestStyle = 'w-1/3 flex justify-center gap-1 mt-2';
  const signupButtonStyle =
    'border-b border-primary cursor-pointer hover:text-primary hover:font-bold ';

  return (
    <div className={displayStyle}>
      <img src={logo} alt="이사모음집 로고" className={logoStyle} onClick={toHome} />
      <div className={loginWrapperStyle}>
        <form onSubmit={(e) => handleSubmitLoginForm(e)} className={loginFormStyle}>
          <div className={inputWrapperStyle}>
            <input
              type="email"
              name="username"
              id="username"
              placeholder="이메일주소"
              value={formData.username}
              onChange={(e) => handleInput(e)}
              className={inputStyle}
            />
            <hr className={lineStyle} />
          </div>
          <div className={inputWrapperStyle}>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={(e) => handleInput(e)}
              className={inputStyle}
            />
            <hr className={lineStyle} />
          </div>
          <button className={buttonStyle}>로그인</button>
        </form>
        <div className={signupRequestStyle}>
          <div>계정이 없으신가요?</div>
          <div className={signupButtonStyle} onClick={handleClickSignupButton}>
            회원가입
          </div>
        </div>
      </div>
    </div>
  );
}

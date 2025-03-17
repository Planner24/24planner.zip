import { useNavigate } from 'react-router-dom';
import logo from '../../public/logo.png';

export default function Login() {
  const navigate = useNavigate();

  const toHome = () => {
    navigate('/');
  };

  const handleSubmitLoginForm = (e) => {
    e.preventDefault();
  };

  const handleClickSignupButton = () => {
    navigate('/signup');
  };

  // CSS
  const displayStyle = 'h-screen flex flex-col justify-center items-center';
  const logoStyle = 'w-64 text-center cursor-pointer';
  const loginWrapperStyle = 'w-full h-1/2 flex flex-col justify-center items-center';
  const loginFormStyle = 'w-130 h-3/4 flex flex-col justify-between items-center box-border pt-15 pb-3';
  const inputWrapperStyle = 'w-full';
  const inputStyle = 'w-full text-xl pl-3 focus:outline-none focus:placeholder-transparent';
  const lineStyle = 'mt-3';
  const buttonStyle =
    'px-12 py-3 text-2xl text-primary cursor-pointer border-3 border-solid rounded-3xl border-primary hover:bg-primary hover:text-white';
  const signupRequestStyle = 'w-1/3 flex justify-center gap-1 mt-2';
  const signupButtonStyle = 'border-b border-primary cursor-pointer hover:text-primary hover:font-bold ';

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

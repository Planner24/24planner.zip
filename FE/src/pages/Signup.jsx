import logo from '../../public/logo.png';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();

  const toHome = () => {
    navigate('/');
  };

  const displayStyle = 'h-screen flex flex-col justify-center items-center gap-10';
  const logoStyle = 'w-48';
  const explainTextStyle = 'text-2xl mb-5';
  const boldTextStyle = 'font-bold text-secondary';
  const inputButtonDiv = 'flex justify-between';
  const inputStyle = 'w-100 mx-1 px-2 focus:outline-none text-xl';
  const buttonStyle =
    'w-25 border-2 border-primary rounded-full px-2 py-1 text-primary hover:bg-primary hover:text-white';
  const lineStyle = 'mt-2 mb-3';
  const passwordNotChecked = 'text-gray-300';
  const passwordChecked = 'text-primary';
  const signupButton =
    'block mt-15 mx-auto border-2 border-primary rounded-2xl px-8 py-2 text-2xl text-primary hover:bg-primary hover:text-white';

  return (
    <div className={displayStyle}>
      <img src={logo} alt="이사모음집 로고" className={logoStyle} onClick={toHome} />
      <h2 className={explainTextStyle}>
        이사모음.zip의 새로운 <b className={boldTextStyle}>Zipper</b>가 되어주세요
      </h2>
      <div>
        <form>
          <div className={inputButtonDiv}>
            <input
              type="email"
              id="username"
              name="username"
              placeholder="이메일 주소"
              className={inputStyle}
              required
            />
            <button type="button" className={buttonStyle}>
              이메일인증
            </button>
          </div>
          <hr className={lineStyle} />
          <div className={inputButtonDiv}>
            <input
              type="number"
              id="code"
              name="code"
              placeholder="인증번호 입력"
              className={inputStyle}
              required
            />
            <button type="button" className={buttonStyle}>
              확인
            </button>
          </div>
          <hr className={lineStyle} />
          <div className={inputButtonDiv}>
            <input
              type="text"
              id="nickname"
              name="nickname"
              placeholder="닉네임"
              className={inputStyle}
              required
            />
            <button type="button" className={buttonStyle}>
              중복확인
            </button>
          </div>
          <hr className={lineStyle} />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="비밀번호"
            className={`${inputStyle} mt-2`}
            required
          />
          <hr className={lineStyle} />
          <div className="flex gap-4 ml-2 pb-1">
            <p className={passwordNotChecked}>✓ 8자 이상</p>
            <p className={passwordNotChecked}>✓ 영문</p>
            <p className={passwordNotChecked}>✓ 숫자</p>
            <p className={passwordNotChecked}>✓ 특수문자(@$!%*#?&)</p>
          </div>
          <input
            type="password"
            id="verifyPassword"
            name="verifyPassword"
            placeholder="비밀번호 확인"
            className={`${inputStyle} mt-2`}
            required
          />
          <hr className={lineStyle} />
          <button className={`${signupButton}`}>회원가입</button>
        </form>
      </div>
    </div>
  );
}

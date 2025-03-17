import { useState } from 'react';
import logo from '../../public/logo.png';
import { useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    code: '',
    nickname: '',
    password: '',
  });
  const [validation, setValidation] = useState({
    username: { isValid: false },
    nickname: { isValid: false },
    password: { isValid: false, isEqual: false },
  });
  const [time, setTime] = useState({
    expiredAt: null,
    remainingTime: '',
  });
  const [usernameState, setUsernameState] = useState({
    isVerifying: false,
    isVerfied: false,
    username: '',
  });
  const [usernameMessage, setUsernameMessage] = useState('');
  const [codeMessage, setCodeMessage] = useState('');
  const [nicknameMessage, setNicknameMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  // 닉네임, 비밀번호 검증
  const checkUsername = (value) => /\S+@\S+\.\S+/.test(value);
  const checkNickname = (value) => /^[가-힣a-zA-Z0-9]{2,15}$/.test(value);
  const checkPassword = (value) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[#?!]).{8,}$/.test(value);
  const checkMinLength = (value) => value.length >= 8;
  const checkLetter = (value) => /[a-zA-Z]/.test(value);
  const checkNumber = (value) => /[0-9]/.test(value);
  const checkSpecialChar = (value) => /[#?!]/.test(value);
  const checkInvalidChar = (value) => /[^A-Za-z0-9#?!]/.test(value);

  // 로고 클릭 시 메인페이지로 이동
  const toHome = () => {
    navigate('/');
  };

  const handleFormInput = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'username') {
      setUsernameMessage('');
    } else if (name === 'nickname') {
      setValidation((prev) => ({
        ...prev,
        nickname: { isValid: checkNickname(value) },
      }));

      if (!value || checkNickname(value)) {
        setNicknameMessage('');
      } else {
        setNicknameMessage('특수문자 제외, 2자 이상 17자 이하여야 합니다.');
      }
    } else if (name === 'password') {
      setValidation((prev) => ({
        ...prev,
        password: { ...prev.password, isValid: checkPassword(value) },
      }));
    }
  };

  const handleVerifyPassword = (e) => {
    const { value } = e.target;

    if (!value || value === formData.password) {
      setPasswordMessage('');
    } else if (value != formData.password) {
      setPasswordMessage('비밀번호가 일치하지 않습니다.');
    }

    setValidation((prev) => ({
      ...prev,
      password: { ...prev.password, isEqual: value === formData.password },
    }));
  };

  const verifyEmail = async () => {
    setUsernameMessage('');

    try {
      if (!formData.username) return;

      if (!checkUsername(formData.username)) {
        setUsernameMessage('유효한 이메일 주소를 입력해주세요.');
        return;
      }

      const response = await authApi.verifyEmail(formData.username);
      const expiredAt = response.data.expiredAt;

      setUsernameState((prev) => ({
        ...prev,
        isVerifying: true,
        username: formData.username,
      }));
      setTime();
    } catch (error) {
      if (error.code === 'EXIST_EMAIL') {
        setUsernameMessage(error.message);
      } else {
        setUsernameMessage('인증 코드 발송에 실패했습니다.');
      }
    } finally {
    }
  };

  const verifyEmailCode = async () => {
    setCodeMessage('');

    try {
      if (!formData.code) return;
    } catch (error) {}
  };

  // 테일윈드 class
  const displayStyle = 'h-screen flex flex-col justify-center items-center gap-10';
  const logoStyle = 'w-48 cursor-pointer';
  const explainTextStyle = 'mb-5 text-2xl ';
  const inputButtonDiv = 'flex justify-between';
  const inputStyle = 'w-100 mx-1 px-2 focus:outline-none text-xl';
  const timeStyle = 'pr-3 self-center text-primary';
  const buttonStyle =
    'w-25 border-2 border-primary rounded-full px-2 py-1 text-primary hover:bg-primary hover:text-white cursor-pointer';
  const lineStyle = 'mt-2';
  const messageStyle = 'mb-2 pl-2 text-red-400';
  const invalid = 'text-gray-300 font-semibold';
  const valid = 'text-primary font-semibold';
  const wrong = 'text-red-400 font-semibold';
  const signupButton =
    'block mt-10 mx-auto border-2 border-primary rounded-2xl px-8 py-2 text-2xl text-primary hover:bg-primary hover:text-white cursor-pointer';

  return (
    <div className={displayStyle}>
      <img src={logo} alt="이사모음집 로고" className={logoStyle} onClick={toHome} />
      <h2 className={explainTextStyle}>
        이사모음.zip의 새로운 <b className="text-secondary">Zipper</b>가 되어주세요
      </h2>
      <div>
        <form>
          <div className={inputButtonDiv}>
            <input
              type="email"
              id="username"
              name="username"
              value={formData.username}
              placeholder="이메일 주소"
              className={inputStyle}
              onChange={handleFormInput}
              required
            />
            <p className={timeStyle}>3:00</p>
            <button
              type="button"
              className={buttonStyle}
              onMouseDown={(e) => e.preventDefault()}
              onClick={verifyEmail}
            >
              이메일인증
            </button>
          </div>
          <hr className={lineStyle} />
          <p className={messageStyle}>{usernameMessage || '\u00A0'}</p>

          <div className={inputButtonDiv}>
            <input
              type="number"
              id="code"
              name="code"
              value={formData.code}
              placeholder="인증번호 입력"
              className={inputStyle}
              onChange={handleFormInput}
              required
            />
            <button
              type="button"
              className={buttonStyle}
              onMouseDown={(e) => e.preventDefault()}
              onClick={verifyEmailCode}
            >
              확인
            </button>
          </div>
          <hr className={lineStyle} />
          <p className={messageStyle}>{codeMessage || '\u00A0'}</p>

          <div className={inputButtonDiv}>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              placeholder="닉네임"
              className={inputStyle}
              onChange={handleFormInput}
              required
            />
            <button type="button" className={buttonStyle}>
              중복확인
            </button>
          </div>
          <hr className={lineStyle} />
          <p className={messageStyle}>{nicknameMessage || '\u00A0'}</p>

          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            placeholder="비밀번호"
            className={`${inputStyle} mt-2`}
            onChange={handleFormInput}
            required
          />
          <hr className={lineStyle} />
          <ul className="flex gap-4 ml-2 mt-1 mb-3">
            <li className={checkMinLength(formData.password) ? valid : invalid}>✓ 8자 이상</li>
            <li className={checkLetter(formData.password) ? valid : invalid}>✓ 영문</li>
            <li className={checkNumber(formData.password) ? valid : invalid}>✓ 숫자</li>
            <li className={checkSpecialChar(formData.password) ? valid : invalid}>
              ✓ 특수문자(#?!)
            </li>
            <li className={checkInvalidChar(formData.password) ? wrong : invalid}>
              ✗ 허용되지 않는 문자
            </li>
          </ul>

          <input
            type="password"
            id="verifyPassword"
            name="verifyPassword"
            placeholder="비밀번호 확인"
            className={`${inputStyle} mt-2`}
            onChange={handleVerifyPassword}
            required
          />
          <hr className={lineStyle} />
          <p className={messageStyle}>{passwordMessage || '\u00A0'}</p>

          <button className={`${signupButton}`}>회원가입</button>
        </form>
      </div>
    </div>
  );
}

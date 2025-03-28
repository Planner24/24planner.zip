import React, { useState } from 'react';
import authApi from '../../api/authApi';
import { useDispatch } from 'react-redux';
import { clearTempToken } from '../../store/slices/authPwdSlice';

export default function Password() {
  const dispatch = useDispatch();

  const [message, setMessage] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [formData, setFormData] = useState({
    password: '',
  });

  const handleInputValue = (e) => {
    const { name, value } = e.target;
    if (name === 'verifyPassword') {
      setVerifyPassword(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (name === 'password') {
      setValidation((prev) => ({
        ...prev,
        password: { isValid: checkPassword(value), isEqual: value === formData.verifyPassword },
      }));

      if (value === verifyPassword || !verifyPassword) {
        setPasswordMessage('');
      } else {
        setPasswordMessage('비밀번호가 일치하지 않습니다.');
      }
    } else if (name === 'verifyPassword') {
      setValidation((prev) => ({
        ...prev,
        password: { ...prev.password, isEqual: value === formData.password },
      }));

      if (!value || value === formData.password) {
        setPasswordMessage('');
      } else if (value != formData.password) {
        setPasswordMessage('비밀번호가 일치하지 않습니다.');
      }
    }
  };

  // 비밀번호 입력값 검증
  const checkPassword = (value) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/.test(value);
  const checkMinLength = (value) => value.length >= 8;
  const checkLetter = (value) => /[a-zA-Z]/.test(value);
  const checkNumber = (value) => /[0-9]/.test(value);
  const checkSpecialChar = (value) => /[@$!%*#?&]/.test(value);
  const checkInvalidChar = (value) => /[^A-Za-z0-9@$!%*#?&]/.test(value);

  const patchPassword = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await authApi.patchPassword(formData);
      const code = response.code;
      const message = response.message;

      if (code === 'OK') {
        dispatch(clearTempToken());
        localStorage.removeItem('tempToken');
      }
    } catch (error) {
      const errorData = error.response.data;
      const code = errorData.code;
      const message = errorData.message;
      if (code !== 'TOOMANY_REQUEST') {
        setMessage(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const container = 'w-full h-screen grid content-center justify-items-center';
  const form = 'relative';
  const inputStyle = 'w-110 m-3 px-2 focus:outline-none text-xl';
  const invalid = 'text-gray-300 font-semibold';
  const valid = 'text-primary font-semibold';
  const wrong = 'text-red-400 font-semibold';
  const lineStyle = 'w-168';
  const buttonStyle =
    'w-45 border-2 rounded-full m-3 px-2 py-1 border-primary text-primary hover:bg-primary hover:text-white cursor-pointer';
  const messageStyle = 'mb-2 pl-2 font-semibold text-red-400';

  return (
    <>
      <div className={`${container}`}>
        <form className={`${form}`}>
          <div>
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              className={inputStyle}
              onChange={handleInputValue}
              required
            />
            <hr className={`${lineStyle}`}></hr>
            <ul class="flex justify-between ml-2 mt-1 mb-3">
              <li
                className={
                  checkMinLength(formData.password) && !checkInvalidChar(formData.password)
                    ? valid
                    : invalid
                }
              >
                ✓ 8자 이상
              </li>
              <li
                className={
                  checkLetter(formData.password) && !checkInvalidChar(formData.password)
                    ? valid
                    : invalid
                }
              >
                ✓ 영문
              </li>
              <li
                className={
                  checkNumber(formData.password) && !checkInvalidChar(formData.password)
                    ? valid
                    : invalid
                }
              >
                ✓ 숫자
              </li>
              <li
                className={
                  checkSpecialChar(formData.password) && !checkInvalidChar(formData.password)
                    ? valid
                    : invalid
                }
              >
                ✓ 특수문자(@$!%*#?&)
              </li>
              <li className={checkInvalidChar(formData.password) ? wrong : invalid}>
                ✗ 허용되지 않는 문자&nbsp;
              </li>
            </ul>
            <input
              type="password"
              name="verifyPassword"
              placeholder="비밀번호 확인"
              className={inputStyle}
              onChange={handleInputValue}
              required
            />
            <hr className={lineStyle} />
            <p className={`${messageStyle} text-red-400`}>{passwordMessage || '\u00A0'}</p>
          </div>
          <button type="button" className={`${buttonStyle}`} onClick={patchPassword}>
            비밀번호 변경
          </button>
        </form>
      </div>
    </>
  );
}

import { useState } from 'react';
import authApi from '../api/authApi';

export default function FindPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState();
  const [formData, setFormData] = useState({
    username: '',
  });

  const handleInputValue = (e) => {
    setMessage();
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendEmail = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await authApi.findPassword(formData);
      const code = response.code;
      const message = response.message;

      setMessage(message);
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
  const image = 'w-64 text-center cursor-pointer absolute left-48 bottom-50';
  const inputStyle = 'w-110 m-3 px-2 focus:outline-none text-xl';
  const lineStyle = 'w-168';
  const buttonStyle =
    'w-45 border-2 rounded-full m-3 px-2 py-1 border-primary text-primary hover:bg-primary hover:text-white cursor-pointer';
  const messageStyle = 'font-semibold text-red-400';

  return (
    <div className={`${container}`}>
      <form className={`${form}`}>
        <img alt="이사모음집 로고" className={`${image}`} src="/src/logo.png"></img>
        <div>
          <input
            type="email"
            name="username"
            placeholder="이메일 주소"
            className={inputStyle}
            onChange={handleInputValue}
            required
          />

          <button type="button" className={`${buttonStyle}`} onClick={sendEmail}>
            가입 이메일 인증
          </button>
        </div>
        <hr className={`${lineStyle}`}></hr>
      </form>
      {message ? <p className={`${messageStyle}`}>{message}</p> : <>&nbsp;</>}
    </div>
  );
}

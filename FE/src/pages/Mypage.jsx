import React from 'react';
import Password from '../component/user/Password';

export default function Mypage() {
  const container = 'w-full mt-30 grid content-center justify-items-center ';
  const form = 'mb-20 relative';
  const inputStyle = 'w-110 m-3 px-2 focus:outline-none text-xl';
  const lineStyle = 'w-168';
  const buttonStyle =
    'w-35 border-2 rounded-full px-2 py-1 border-primary text-primary hover:bg-primary hover:text-white cursor-pointer absolute right-1';
  const del = 'text-gray-300 relative top-20';

  return (
    <>
      <div className={`${container}`}>
        <form className={`${form}`}>
          <div>
            <input
              type="text"
              name="nickname"
              placeholder="닉네임"
              className={inputStyle}
              required
            />

            <button type="button" className={`${buttonStyle}`}>
              닉네임 변경
            </button>
          </div>
          <hr className={`${lineStyle}`}></hr>
        </form>

        <Password></Password>
        <button className={`${del}`}>탈퇴하기</button>
      </div>
    </>
  );
}

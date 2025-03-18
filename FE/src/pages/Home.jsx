import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  let isAlreadyVisited = null;

  const [charClass1, setCharClass1] = useState('');
  const [charClass2, setCharClass2] = useState('');
  const [charClass3, setCharClass3] = useState('');
  const [charClass4, setCharClass4] = useState('');
  const [charClass5, setCharClass5] = useState('');

  const [textClass1, setTextClass1] = useState('text-primary');
  const [textClass2, setTextClass2] = useState('text-primary');
  const [textClass3, setTextClass3] = useState('');
  const [textClass4, setTextClass4] = useState('');
  const [textClass5, setTextClass5] = useState('');

  const flexStyle = 'flex justify-center item-center';
  const flexColStyle = 'flex flex-col justify-center item-center';

  useEffect(() => {
    isAlreadyVisited = localStorage.getItem('isAlreadyVisited');
    if (!isAlreadyVisited) {
      localStorage.setItem('isAlreadyVisited', 'true');

      setCharClass1(() => 'relative animate-main-char1');
      setCharClass2(() => 'relative animate-main-char2');
      setCharClass3(() => 'relative animate-main-char3');
      setCharClass4(() => 'relative animate-main-char4');
      setCharClass5(() => 'relative animate-main-char5');

      setTextClass1(() => 'text-primary invisible');
      setTextClass2(() => 'text-primary invisible');
      setTextClass3(() => 'invisible');
      setTextClass4(() => 'invisible');
      setTextClass5(() => 'invisible animate-main-string');
    }
  }, []);

  // timer를 별도의 useEffect에서 설정하지 않으면, setTimeout이 localStorage.getItem과 충돌이 생겨 딜레이가 적용되지 않는 문제 존재
  useEffect(() => {
    const timers = [];

    timers.push(
      setTimeout(() => {
        setTextClass1('text-primary');
      }, 1100),
    );

    timers.push(
      setTimeout(() => {
        setTextClass2('text-primary');
      }, 1600),
    );

    timers.push(
      setTimeout(() => {
        setTextClass3('');
      }, 2100),
    );

    timers.push(
      setTimeout(() => {
        setTextClass4('');
      }, 2600),
    );

    timers.push(
      setTimeout(() => {
        setTextClass5('animate-main-string');
      }, 3600),
    );

    return () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
      });
    };
  }, []);

  return (
    <main className={`${flexStyle} h-full`}>
      <div className={flexColStyle}>
        <div className={`${flexStyle} text-6xl font-extrabold p-8`}>
          <span className={charClass1}>흩</span>
          <span className={charClass2}>어</span>
          <span className={charClass3}>져</span>
          <span>&nbsp;</span>
          <span className={charClass4}>있</span>
          <span className={charClass5}>는</span>
          <span>&nbsp;</span>
          <span className={textClass1}>이</span>
          <span className={textClass2}>사</span>
          <span className={textClass3}>의</span>
          <span>&nbsp;</span>
          <span className={textClass4}>모든 것</span>
        </div>
        <div className={`${flexStyle} text-4xl p-8`}>
          <span className={textClass5}>막막한 이사, 이사모음.zip과 깐깐하게 함께 해요!</span>
        </div>
        <div className={`${flexStyle} p-12`}>
          <Link to="/login">
            <button className="w-60 h-20 bg-white border-4 border-primary rounded-3xl text-primary text-4xl font-bold cursor-pointer hover:bg-primary hover:text-white">
              시작하기
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}

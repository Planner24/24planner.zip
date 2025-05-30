import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomeWithAnimation from '../component/home/HomeWithAnimation';
import HomeWithoutAnimation from '../component/home/HomeWithoutAnimation';

export default function Home() {
  // 처음부터 false로 하면 두 번째 방문 이후 순간적인 레이아웃 변형이 있어, 아무 레이아웃도 나타내지 않는 null로 지정
  const [isAlreadyVisited, setIsAlreadyVisited] = useState(null);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // localStorage의 getItem이 즉각적으로 동작하지 않아, setTimeout과 연계 시 timer가 제대로 동작하지 않음
  // 따라서 첫 방문 여부에 따라 출력 Component 구분
  // useEffect는 한 번만 실행되어야 하나, setIsAlreadyVisited(() => false); 때문에 한 번 더 실행됨
  // 이 때문에 visitCount가 2회가 될 때까지를 첫 방문으로 가정
  useEffect(() => {
    if (!localStorage.getItem('visitCount') || localStorage.getItem('visitCount') === '0') {
      localStorage.setItem('visitCount', '1');
      setIsAlreadyVisited(() => false);
    } else if (localStorage.getItem('visitCount') === '1') {
      localStorage.setItem('visitCount', '2');
      setIsAlreadyVisited(() => false);
    } else {
      setIsAlreadyVisited(() => true);
    }
  }, []);

  const flexStyle = 'flex justify-center item-center';
  const flexColStyle = 'flex flex-col justify-center item-center';
  const mainStyle = flexStyle + ' h-full';
  const buttonDivStyle = flexStyle + ' p-12';
  const buttonStyle =
    'w-60 h-20 bg-white border-4 border-primary rounded-3xl text-primary text-4xl font-bold cursor-pointer hover:bg-primary hover:text-white';

  return (
    <main className={mainStyle}>
      <div className={flexColStyle}>
        {isAlreadyVisited !== null ? (
          isAlreadyVisited ? (
            <HomeWithoutAnimation />
          ) : (
            <HomeWithAnimation />
          )
        ) : (
          <></>
        )}
        <div className={buttonDivStyle}>
          <Link to={isLoggedIn ? '/plans' : '/login'}>
            <button className={buttonStyle}>시작하기</button>
          </Link>
        </div>
      </div>
    </main>
  );
}

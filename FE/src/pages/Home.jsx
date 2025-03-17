import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex justify-center item-center h-full">
      <div className="flex flex-col justify-center item-center">
        <div className="flex justify-center item-center text-6xl font-extrabold p-8">
          흩어져 있는 <span>&nbsp;</span>
          <span className="text-primary">이사</span>의 모든 것
        </div>
        <div className="flex justify-center item-center text-4xl p-8">
          막막한 이사, 이사모음.zip과 깐깐하게 함께 해요!
        </div>
        <div className="flex justify-center item-center p-12">
          <Link to="/login">
            <button className="w-60 h-20 text-white text-4xl bg-primary rounded-3xl cursor-pointer font-bold">
              시작하기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

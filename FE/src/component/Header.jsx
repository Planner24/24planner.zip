export default function Header() {
  return (
    <div className="h-full">
      <div className="flex justify-between h-full p-2">
        <div className="flex flex-row flex-6 font-bold">
          <div className="flex items-center p-4 max-w-40">
            <img src="/logo.png" className="" />
          </div>

          {/* 로그인 후 화면까지 구현한 시점에서 활성화 예정 /*}
          {/* <div className="flex items-center p-4 text-2xl text-primary">체크리스트</div>
          <div className="flex items-center p-4 text-2xl">캘린더</div> */}
        </div>

        <div className="flex flex-row flex-4 justify-end">
          {/* 로그인 후 화면까지 구현한 시점에서 활성화 예정 /*}
          {/* <div className="flex items-center p-4 text-2xl text-secondary">이사 플랜 1</div>
          <div className="flex items-center p-4 text-2xl">로그아웃</div> */}
        </div>
      </div>
    </div>
  );
}

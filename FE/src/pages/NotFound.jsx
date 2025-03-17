export default function NotFound() {
  return (
    <div className="flex flex-col justify-center item-center h-full">
      <div className="flex justify-center item-center">
        <img src="/notfound.png" />
      </div>
      <div className="text-center text-3xl p-8">페이지를 찾을 수 없습니다.</div>
    </div>
  );
}

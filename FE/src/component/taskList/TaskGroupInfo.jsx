export default function TaskGroupInfo() {
  // CSS
  const checkgroupInfoWrapperStyle = 'w-full flex justify-between items-center mb-4';
  const checkgroupInfoStyle = 'flex gap-5 items-center';
  const checkgroupTitleStyle = 'text-xl';
  const buttonStyle = 'text-gray-500 text-opacity-70 underline cursor-pointer hover:text-primary';

  return (
    <section className={checkgroupInfoWrapperStyle}>
      <div className={checkgroupInfoStyle}>
        <h1 className={checkgroupTitleStyle}>서류 준비하기</h1>
        <div className={buttonStyle}>수정</div>
      </div>
      <div className={buttonStyle}>체크 그룹 삭제</div>
    </section>
  );
}

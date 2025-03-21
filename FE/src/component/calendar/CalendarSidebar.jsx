export default function CalendarSidebar({ selectDate, scheduleList }) {
  // Tailwind CSS에서 사용할 색상 Class들을 미리 선언
  // TODO: 임시적인 목록이므로, 추후 변경될 수 있음
  const tempUsingColor = ['bg-[#69db7c]', 'bg-[#4dabf7]', 'bg-[#2f9e44]', 'bg-[#fcc2d7]'];

  const calendarSidebar = 'flex flex-1 flex-col items-center m-4';

  return (
    <section className={calendarSidebar}>
      {selectDate ? (
        <>
          <div className="text-2xl mt-12">
            {Number.parseInt(selectDate.substring(0, 4))}년{' '}
            {Number.parseInt(selectDate.substring(5, 7))}월{' '}
            {Number.parseInt(selectDate.substring(8, 10))}일
          </div>
          <div className="flex flex-col w-full mt-8">
            {scheduleList.map((schedule, i) => {
              return (
                <div key={i} className="flex items-center">
                  <div
                    className={`flex justify-center items-center bg-[${schedule.color}] rounded-3xl text-xl w-full p-2 m-2`}
                  >
                    {schedule.content}
                  </div>
                  <div className="p-2">
                    <img src="/pencil.png" className="w-8 h-7" />
                  </div>
                  <div className="p-2">
                    <img src="/bin.png" className="w-8 h-7" />
                  </div>
                </div>
              );
            })}
            <div className="flex items-center">
              <div className="flex justify-center items-center border-1 border-gray-300 rounded-3xl w-full m-2 h-11">
                <input
                  type="text"
                  placeholder="할 일 추가"
                  className="focus:outline-none w-full p-2"
                ></input>
              </div>
              <div className="flex justify-center items-center mx-2 px-7 bg-primary rounded-3xl h-11">
                +
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </section>
  );
}

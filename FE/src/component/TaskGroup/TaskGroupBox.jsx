export default function TaskGroupBox() {
  const section = 'flex flex-wrap gap-5 justify-center';
  const groupBox =
    'w-100 h-35 border-3 rounded-3xl px-2 py-5 bg-white font-roboto flex flex-col items-center justify-center';
  const boxText = 'text-lg font-roboto pr-60 m-3';
  const gauge = 'w-90 h-7 border-2 rounded-full px-2 py-1 border-primary bg-primary ';
  const addBox =
    'w-100 h-35 border-3 border-gray-200 rounded-3xl px-2 py-5 flex items-center justify-center';
  const addBoxText = 'text-gray-200 text-2xl font-roboto ';
  const changeAddBox = 'w-100 h-35 border-3 rounded-3xl px-2 py-5 flex items-center justify-center';
  const addBtn =
    'w-20 border-2 rounded-xl px-2 py-1 border-primary text-primary hover:bg-primary hover:text-white cursor-pointer';
  const inputText =
    'w-50 border-3 border-b-gray-200 border-x-white border-t-white m-5 placeholder:text-gray-200';
  return (
    <section className={`${section}`}>
      <div className={`${groupBox}`}>
        <span className={`${boxText}`}>체크 그룹1</span>
        <div className={`${gauge}`}></div>
      </div>

      <div className={`${addBox}`}>
        <span className={`${addBoxText}`}>+</span>
      </div>

      <div className={`${changeAddBox}`}>
        <input className={`${inputText}`} type="text" placeholder="체크 그룹 추가" />
        <button className={`${addBtn}`}>추가</button>
      </div>
    </section>
  );
}

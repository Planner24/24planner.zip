export default function Task() {
  // CSS
  const checkpointInfoStyle = 'flex justify-between items-center box-border mb-10';
  const checkpointStyle = 'flex items-center gap-5';
  const checkBoxStyle = 'hidden peer';
  const checkBoxLabelStyle =
    'w-6 h-6 flex items-center justify-center rounded-md border-2 border-primary cursor-pointer peer-checked:bg-primary peer-checked:border-primary peer-checked:before:content-["✔"] peer-checked:before:text-white';
  const checkpointContentStyle = '';
  const deleteCheckpointStyle = 'text-gray-500 text-opacity-70 cursor-pointer';

  return (
    <div className={checkpointInfoStyle}>
      <div className={checkpointStyle}>
        <input type="checkbox" id="check1" className={checkBoxStyle} />
        <label htmlFor="check1" className={checkBoxLabelStyle}></label>
        <div className={checkpointContentStyle}>체크포인트 내용</div>
      </div>
      <div className={deleteCheckpointStyle}>✕</div>
    </div>
  );
}

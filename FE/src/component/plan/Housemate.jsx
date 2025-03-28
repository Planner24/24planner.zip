export default function Housemate({ housemate, canManage }) {
  const { id, username, nickname, isOwner } = housemate;

  // CSS
  const housemateLi = 'flex items-center mt-10';
  const ownerCheck = 'w-5';
  const textStyle = 'ml-5 text-xl';
  const usernameStyle = 'text-primary';
  const deleteButtonStyle = 'ml-5 text-gray-500 text-opacity-70 cursor-pointer';

  return (
    <li className={housemateLi}>
      <p className={ownerCheck}>{isOwner ? '👑' : '👤'}</p>
      <p className={textStyle}>{nickname}</p>
      <p className={`${textStyle} ${usernameStyle}`}>({username})</p>
      {canManage && !isOwner && <button className={deleteButtonStyle}>✕</button>}
    </li>
  );
}

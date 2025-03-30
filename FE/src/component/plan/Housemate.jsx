export default function Housemate({ housemateId, housemate, canManage }) {
  const { id, username, nickname, isOwner } = housemate;

  // CSS
  const housemateLi = 'flex items-center mt-10';
  const ownerCheck = 'w-5';
  const textStyle = 'ml-5 text-xl';
  const usernameStyle = 'text-primary';
  const whoAmIStyle = 'ml-3 text-gray-500';
  const deleteButtonStyle = 'ml-5 text-gray-500 text-opacity-70 cursor-pointer';

  return (
    <li className={housemateLi}>
      <p className={ownerCheck}>{isOwner ? '👑' : '👤'}</p>
      <p className={textStyle}>{nickname}</p>
      <p className={`${textStyle} ${usernameStyle}`}>({username})</p>
      {housemateId == id && <p className={whoAmIStyle}>( 나 )</p>}
      {canManage && !isOwner && <button className={deleteButtonStyle}>✕</button>}
    </li>
  );
}

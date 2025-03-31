import Housemate from './Housemate';

export default function HousemateListSection({
  housemates,
  myHousemateId,
  canManage,
  onHousemateDelete,
}) {
  // CSS
  const displayStyle = 'mx-60 mt-15';
  const titleStyle = 'ml-5 text-primary text-xl';
  const listContainer = 'w-180 mt-10 px-20 pt-5 pb-15 border-2 border-primary rounded-3xl';

  return (
    <div className={displayStyle}>
      <h2 className={titleStyle}>이사에 함께 하는 Zipper</h2>
      <ul className={listContainer}>
        {housemates.map((housemate) => (
          <Housemate
            key={housemate.id}
            myHousemateId={myHousemateId}
            housemate={housemate}
            canManage={canManage}
            onHousemateDelete={onHousemateDelete}
          />
        ))}
      </ul>
    </div>
  );
}

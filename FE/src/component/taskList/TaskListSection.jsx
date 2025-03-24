import Task from './Task';

export default function TaskListSection({ totalCount, completeCount, tasks }) {

  // CSS
  const checkpointWrapperStyle = 'w-full';
  const checkpointCountingStyle = 'text-right text-xl text-primary mb-2 pr-7';
  const checkpointListStyle =
    'border rounded-3xl border-primary border-2 mb-10 px-18 py-12 h-120 overflow-y-auto';

  return (
    <section className={checkpointWrapperStyle}>
      <div className={checkpointCountingStyle}>
        {completeCount} / {totalCount}
      </div>
      <ul className={checkpointListStyle}>
        {
          tasks?.map((task) => {
            const { id, content, isCompleted } = task;
            return <Task key={id} id={id} content={content} isCompleted={isCompleted}></Task>
          })
        }
      </ul>
    </section>
  );
}

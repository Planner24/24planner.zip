import TaskGroupInfo from '../component/taskList/TaskGroupInfo';
import TaskGroupMemo from '../component/taskList/TaskGroupMemo';
import TaskListSection from '../component/taskList/TaskListSection';

export default function TaskList() {
  // CSS
  const mainStyle = 'flex flex-col justify-center items-center pl-60 pr-60 pt-15 pb-15 box-border';

  return (
    <main className={mainStyle}>
      <TaskGroupInfo></TaskGroupInfo>
      <TaskListSection></TaskListSection>
      <TaskGroupMemo></TaskGroupMemo>
    </main>
  );
}

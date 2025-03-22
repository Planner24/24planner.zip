export default function Footer() {
  const footerClass = 'h-18 flex flex-col justify-center items-center';
  const footerTextClass = 'text-md';
  return (
    <footer className={footerClass}>
      <div className={footerTextClass}>planner24.zip</div>
      <div className={footerTextClass}>
        <a href="https://www.flaticon.com/free-icons/pencil" title="pencil icons">
          Pencil icons created by Freepik - Flaticon
        </a>
      </div>
      <div className={footerTextClass}>
        <a href="https://www.flaticon.com/free-icons/trash" title="trash icons">
          Trash icons created by Freepik - Flaticon
        </a>
      </div>
    </footer>
  );
}

import { Outlet } from 'react-router-dom';
import Header from '../component/Header';
import Footer from '../component/Footer';
import PopoverUtilComponent from '../component/calendar/popover/PopoverUtilComponent';

export default function RootLayout() {
  return (
    <>
      <div className="flex flex-col items-center h-screen w-screen min-h-180 min-w-320 font-roboto">
        <PopoverUtilComponent>
          <div className="h-1/10 min-w-320">
            <Header />
          </div>
          <div className="h-4/5 min-w-320">
            <Outlet />
          </div>
          <div className="h-1/10 min-w-320">
            <Footer />
          </div>
        </PopoverUtilComponent>
      </div>
    </>
  );
}

import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PwdLayout = () => {
  // const tempAccessToken = useSelector((state) => state.authPwd.tempToken);
  // console.log(tempAccessToken)
  const storedTokenData = localStorage.getItem('tempToken');
  console.log(storedTokenData);

  // return tempAccessToken ? <Outlet /> : <Navigate to="/notfound" />;
  return storedTokenData ? <Outlet /> : <Navigate to="/notfound" />;
};

export default PwdLayout;

import { Navigate, Outlet } from 'react-router-dom';

const PwdLayout = () => {
  const storedTokenData = localStorage.getItem('tempToken');

  return storedTokenData ? <Outlet /> : <Navigate to="/notfound" />;
};

export default PwdLayout;

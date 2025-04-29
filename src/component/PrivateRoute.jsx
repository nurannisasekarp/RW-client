import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext'; // pastikan path-nya benar

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;

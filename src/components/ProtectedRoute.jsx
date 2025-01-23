import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children }) => {
    return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;

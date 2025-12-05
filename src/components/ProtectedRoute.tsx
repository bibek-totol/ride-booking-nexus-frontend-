import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  
  if (location.pathname === "/oauth-success") {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }




if (!isAuthenticated) {
  return <Navigate to="/login" replace />;
}


if (
  user.role === "rider" &&
  user.blocked === true &&
  location.pathname !== "/rider/profile"
) {
  return <Navigate to="/rider/profile" replace />;
}


if (allowedRoles && !allowedRoles.includes(user.role)) {
  return <Navigate to={`/${user.role}`} replace />;
}

return <>{children}</>;



};

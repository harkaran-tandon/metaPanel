import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles: string[];
};

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  const role = user?.publicMetadata?.role as string;

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

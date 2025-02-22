import { useAuth } from "@/context/AuthContext";
import {Navigate } from "react-router-dom";
import { toast } from "sonner";

interface ProtectedRouteProps {
  component: React.ReactNode;
};

export default function ProtectedRoute({ component } : ProtectedRouteProps) {
  const { currentUser } = useAuth();

  if(!currentUser){
    return <Navigate to="/login" />
  }

  return <>{component}</> ;
}
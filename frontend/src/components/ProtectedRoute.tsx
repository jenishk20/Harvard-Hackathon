import { useAuth } from "@/context/AuthContext";
import {Navigate } from "react-router-dom";
import React from "react";
import Navbar from "./Navbar";

interface ProtectedRouteProps {
  component: React.ReactNode;
};

export default function ProtectedRoute({ component } : ProtectedRouteProps) {
  const { currentUser } = useAuth();

  if(!currentUser){
    return <Navigate to="/login" />
  }

  return <React.Fragment><Navbar currentUser={currentUser}/>{component}</React.Fragment> ;
}
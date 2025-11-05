import { AuthContext } from "@/context/authContext";
import React, { useContext } from "react";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) {
    toast.error("You are not logged in!");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

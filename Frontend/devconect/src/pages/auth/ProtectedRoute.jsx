import { AuthContext } from "@/context/authContext";
import React, { useContext } from "react";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    toast.error("You are not logged in!");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

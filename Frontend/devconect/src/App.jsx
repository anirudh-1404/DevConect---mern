import React from "react";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./common/layouts/Layout";
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Profile from "./pages/Profile";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import UpdateProfile from "./pages/UpdateProfile";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/register", element: <Register /> },
        { path: "/login", element: <Login /> },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "/updateProfile",
          element: (
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          success: { duration: 2500 },
          error: { duration: 3000 },
        }}
      />
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;

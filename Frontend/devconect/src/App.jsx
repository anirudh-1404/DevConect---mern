import React from "react";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./common/layouts/Layout";
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { SocketContextProvider } from "./context/SocketContext";
import Profile from "./pages/Profile";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import UpdateProfile from "./pages/UpdateProfile";
import DevelopersPage from "./pages/DevelopersPage";
import DeveloperProfile from "./pages/DeveloperProfile";
import RecruitersPage from "./pages/RecruitersPage";
import RecruitersProfile from "./pages/RecruitersProfile";
import CreatePost from "./pages/CreatePost";
import Community from "./pages/Community";
import About from "./pages/About";
import Chat from "./pages/Chat";
import PostDetails from "./pages/PostDetails";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import CreateJob from "./pages/CreateJob";
import Dashboard from "./pages/Dashboard";
import CodingSessions from "./pages/CodingSessions";
import CodingSession from "./pages/CodingSession";
import ResumeBuilder from "./pages/ResumeBuilder";
import RecruiterCRM from "./pages/RecruiterCRM";
import InterviewRoom from "./pages/InterviewRoom";
import ScheduleInterview from "./pages/ScheduleInterview";
import InterviewsList from "./pages/InterviewsList";
import Hackathons from "./pages/Hackathons";
import CreateHackathon from "./pages/CreateHackathon";
import HackathonDetails from "./pages/HackathonDetails";

const App = () => {
  // Force reload for route changes
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
        {
          path: "/developers",
          element: (
            <ProtectedRoute>
              <DevelopersPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/developers/:id",
          element: (
            <ProtectedRoute>
              <DeveloperProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "/recruiters",
          element: (
            <ProtectedRoute>
              <RecruitersPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/recruiters/:id",
          element: (
            <ProtectedRoute>
              <RecruitersProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "/recruiter/crm",
          element: (
            <ProtectedRoute>
              <RecruiterCRM />
            </ProtectedRoute>
          ),
        },
        {
          path: "/post/create",
          element: (
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          ),
        },
        {
          path: "/post/:id",
          element: (
            <ProtectedRoute>
              <PostDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "/community",
          element: <Community />,
        },
        {
          path: "/jobs",
          element: <ProtectedRoute> <Jobs /> </ProtectedRoute>,
        },
        {
          path: "/jobs/create",
          element: (
            <ProtectedRoute>
              <CreateJob />
            </ProtectedRoute>
          ),
        },
        {
          path: "/jobs/:id",
          element: <ProtectedRoute> <JobDetails /> </ProtectedRoute>,
        },
        {
          path: "/coding-sessions",
          element: (
            <ProtectedRoute>
              <CodingSessions />
            </ProtectedRoute>
          ),
        },
        {
          path: "/coding-session/:id",
          element: (
            <ProtectedRoute>
              <CodingSession />
            </ProtectedRoute>
          ),
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/messages",
          element: (
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "/resume-builder",
          element: (
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          ),
        },
        {
          path: "/interview/:roomId",
          element: (
            <ProtectedRoute>
              <InterviewRoom />
            </ProtectedRoute>
          ),
        },
        {
          path: "/schedule-interview",
          element: (
            <ProtectedRoute>
              <ScheduleInterview />
            </ProtectedRoute>
          ),
        },
        {
          path: "/interviews",
          element: (
            <ProtectedRoute>
              <InterviewsList />
            </ProtectedRoute>
          ),
        },
        {
          path: "/hackathons",
          element: (
            <ProtectedRoute>
              <Hackathons />
            </ProtectedRoute>
          ),
        },
        {
          path: "/hackathons/create",
          element: (
            <ProtectedRoute>
              <CreateHackathon />
            </ProtectedRoute>
          ),
        },
        {
          path: "/hackathons/:id",
          element: (
            <ProtectedRoute>
              <HackathonDetails />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);
  return (
    <AuthProvider>
      <SocketContextProvider>
        <RouterProvider router={router} />
        <Toaster />
      </SocketContextProvider>
    </AuthProvider>
  );
};

export default App;

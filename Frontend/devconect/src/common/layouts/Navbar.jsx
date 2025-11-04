import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [avatar, setAvatar] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL_API}/auth/profile`,
        { withCredentials: true }
      );
      setAvatar(data.avatar);
    };

    fetchUser();
  }, []);

  return (
    <nav className="sticky top-0 left-0 w-full z-50 bg-[#0f2027]/70 backdrop-blur-lg border-b border-white/10 shadow-md">
      <div className="max-w-7xl mx-auto px-8 py-3 flex justify-between items-center">
        <div className="logo text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 text-transparent bg-clip-text drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]">
          <Link to="/">DevConnect</Link>
        </div>

        <div className="hidden md:flex gap-8 text-white font-medium">
          {["Home", "Developers", "Projects", "Community"].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="relative group transition-all duration-300"
            >
              <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-500">
                {item}
              </span>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </div>

        <div className="auth text-white flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <button
                  className="px-6 py-2 rounded-full border border-cyan-400 text-cyan-400 font-medium text-sm tracking-wide uppercase transition-all duration-300 ease-in-out 
          hover:bg-gradient-to-r hover:from-cyan-400 hover:to-blue-500 hover:text-white hover:shadow-[0_0_10px_#06b6d4] 
          active:scale-95 backdrop-blur-sm"
                >
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button
                  className="px-6 py-2 rounded-full border border-blue-500 text-blue-400 font-medium text-sm tracking-wide uppercase transition-all duration-300 ease-in-out 
          hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white hover:shadow-[0_0_10px_#3b82f6] 
          active:scale-95 backdrop-blur-sm"
                >
                  Register
                </button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer hover:ring-2 ring-cyan-400 transition-all">
                  <AvatarImage
                    src={avatar || "http://github.com/shadcn.png"}
                    alt="User Avatar"
                  />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-gray-600 backdrop-blur-md border border-white/10 text-white shadow-lg rounded-xl p-2"
              >
                <Link to="/profile">
                  <DropdownMenuItem className="hover:bg-white/10 rounded-md cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="hover:bg-white/10 rounded-md cursor-pointer">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="text-red-400 hover:text-red-500 hover:bg-white/10 rounded-md cursor-pointer"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UsersRound } from "lucide-react";
import axios from "axios";

const DevelopersSection = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL_API}/developers`
        );
        console.log("Response:", response.data.devs);

        setUsers(response.data.devs);
      } catch (err) {
        console.error("Something went wrong while fetching users", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <section className="mt-20 mb-16 px-6 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 py-12 mx-7 rounded-3xl border border-white/10 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
      <div className="flex justify-center items-center gap-3 mb-10">
        <UsersRound
          size={42}
          className="text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]"
        />
        <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 text-4xl font-extrabold text-center tracking-wide">
          Meet Top Developers
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 px-6">
        {users.map((dev, index) => (
          <Card
            key={index}
            className="bg-white/10 rounded-2xl p-6 border border-white/10 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:-translate-y-2 transition-all duration-300"
          >
            <CardHeader className="flex flex-col items-center space-y-4">
              <img
                src={dev.avatar || "https://github.com/shadcn.png"}
                alt={dev.name || dev.username}
                className="w-20 h-20 rounded-full border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
              />
              <CardTitle className="text-white text-lg font-semibold text-center">
                {dev.username}
              </CardTitle>
              <CardDescription className="text-gray-400 text-sm font-medium text-center">
                {dev.role || "Developer"}
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex justify-center">
              <button className="text-white bg-gradient-to-r from-cyan-400 to-blue-600 px-6 py-2.5 rounded-full text-sm font-semibold hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:scale-105 transition-all duration-300">
                View Profile
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default DevelopersSection;

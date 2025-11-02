import React from "react";
import { Users, FolderOpen, MessageSquare, Upload } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const cardContent = [
  {
    title: "Find Developers",
    icon: <Users className="w-8 h-8 text-cyan-400" />,
  },
  {
    title: "Browse Projects",
    icon: <FolderOpen className="w-8 h-8 text-blue-400" />,
  },
  {
    title: "Join Communities",
    icon: <MessageSquare className="w-8 h-8 text-purple-400" />,
  },
  {
    title: "Post Your Work",
    icon: <Upload className="w-8 h-8 text-green-400" />,
  },
];

export default function ExploreSection() {
  return (
    <div className="flex flex-col items-center text-white mt-24 mb-10 px-6">
      <h2 className="text-4xl font-bold text-center mb-12 relative inline-block">
        Explore DevConnect
        <span className="absolute left-0 -bottom-2 w-full h-[3px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full max-w-6xl">
        {cardContent.map((item, index) => (
          <Card
            key={index}
            className="w-full text-center bg-white/10 border border-white/20 backdrop-blur-md hover:scale-105 hover:border-cyan-400 transition-transform duration-300 rounded-2xl shadow-lg p-6"
          >
            <CardHeader className="flex flex-col items-center space-y-4">
              {item.icon}
              <CardTitle className="text-xl font-semibold text-white">
                {item.title}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

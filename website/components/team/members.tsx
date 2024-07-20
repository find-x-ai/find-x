"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface Member {
  name: string;
  email: string;
  profile: string;
  role: string;
}

const membersList: Member[] = [
  {
    name: "Sahil Mulani",
    email: "sahil.finx@gmail.com",
    profile: "https://github.com/sahilm416.png",
    role: "Founder and CEO",
  },
  {
    name: "Sohel Mujawar",
    email: "sohelmujawar1807@gmail.com",
    profile: "https://github.com/sohel1807.png",
    role: "Founder and Data engg.",
  },
  {
    name: "Saad Momin",
    email: "saadmomin@gmail.com",
    profile: "https://github.com/saadmomin2903.png",
    role: "Founder and Data engg.",
  },
];

export const Members: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showMemberList, setShowMemberList] = useState(true);

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setShowMemberList(false);
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-[calc(100vh-60px)]">
      <div className={`w-full md:w-1/3 h-full md:border-r overflow-y-auto ${showMemberList ? 'block' : 'hidden md:block'}`}>
        <div className="flex flex-col p-4 md:p-6">
          {membersList.map((member, i) => (
            <div 
              key={i} 
              className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-colors duration-300 ${
                selectedMember === member ? 'bg-zinc-200' : 'hover:bg-zinc-200'
              }`}
              onClick={() => handleMemberClick(member)}
            >
              <img 
                src={member.profile} 
                alt={member.name} 
                className="w-16 h-16 md:w-16 md:h-16 rounded-full object-cover border-2 border-zinc-300"
              />
              <div>
                <h2 className="text-base md:text-lg font-semibold">{member.name}</h2>
                <p className="text-xs md:text-sm text-zinc-600">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`w-full md:w-2/3 h-[calc(100vh-70px)] bg-zinc-200 overflow-y-scroll p-6 md:p-10 flex md:items-center justify-center ${showMemberList ? 'hidden md:flex' : 'flex'}`}>
        {selectedMember ? (
          <div className="w-full max-w-2xl flex flex-col items-center">
            <button 
              className="self-start mb-4 md:hidden text-zinc-600 hover:text-zinc-800 flex gap-2"
              onClick={() => setShowMemberList(true)}
            >
              <ChevronLeft /> back
            </button>
            <img 
              src={selectedMember.profile} 
              alt={selectedMember.name} 
              className="w-32 h-32 md:w-64 md:h-64 rounded-full object-cover border-4 border-zinc-300 shadow-lg mb-4 md:mb-8"
            />
            <h1 className="text-2xl md:text-4xl font-bold mb-2 text-center">{selectedMember.name}</h1>
            <h2 className="text-xl md:text-2xl text-zinc-600 mb-2 md:mb-4 text-center">{selectedMember.role}</h2>
            <p className="text-lg md:text-xl mb-4 md:mb-8 text-center">{selectedMember.email}</p>
            <div className="w-full bg-white rounded-lg shadow-md p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">About {selectedMember.name}</h3>
              <p className="text-sm md:text-base text-zinc-700">
                {selectedMember.name} is a key member of our team, bringing valuable expertise and leadership to their role as {selectedMember.role}. 
                Their contributions have been instrumental in shaping the direction and success of our projects.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center w-full h-full">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Together we built findx</h1>
            <p className="text-lg md:text-xl text-zinc-600">Select a team member to view their details</p>
          </div>
        )}
      </div>
    </div>
  );
};
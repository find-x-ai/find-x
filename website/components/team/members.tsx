"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Link as LinkIcon } from "lucide-react";

interface Member {
  name: string;
  email: string;
  profile: string;
  role: string;
  about: string;
  x: string;
}

const membersList: Member[] = [
  {
    name: "Sahil Mulani",
    email: "sahil.findx@gmail.com",
    profile: "https://github.com/sahilm416.png",
    role: "Founder and CEO",
    about: `Sahil Mulani is the CEO and founder of Find-X, an AI-powered search engine.\n
    With a background in data science and software engineering, Sahil is passionate about making online information easier to access and more relevant.\n
    He leads the team at Find-X with a focus on innovation and efficiency, ensuring the search engine delivers accurate results quickly.`,
    x: "https://x.com/sahil__501",
  },
  {
    name: "Sohel Mujawar",
    email: "sohelmujawar1807@gmail.com",
    profile: "https://github.com/sohel1807.png",
    role: "Founder and Data Engineer",
    about: `Sohel Mujawar is the founder and Data Engineer at Find-X.\n
    He has extensive practical experience in data science and machine learning, which he leverages to optimize data processing and analysis within the platform.\n
    His expertise in building scalable data systems has been instrumental in the development of the search engine's core functionalities.`,
    x: "https://x.com/sohel_mujawar07",
  },
  {
    name: "Saad Momin",
    email: "saadmomin5555@gmail.com",
    profile: "https://github.com/saadmomin2903.png",
    role: "Data Engineer",
    about: `Saad Momin is a founder and Data Engineer at Find-X.\n
    He works closely with Sohel Mujawar, providing crucial support in developing and maintaining the platform's data infrastructure.\n
    As a helping hand to the team, Saad ensures that all systems run smoothly and efficiently, playing a key role in troubleshooting and optimizing processes.\n`,
    x: "https://x.com/saadlegend0",
  },
  {
    name: "Suyog Patil",
    email: "suyogpatil1810@gmail.com",
    profile: "https://github.com/xspatrian.png",
    role: "Security Engineer",
    about: `As a Security Engineer, Suyog Patil focuses on safeguarding our systems and data while working directly with clients to address their security needs. \n \n His role involves implementing security protocols and ensuring compliance to protect our users' information.`,
    x: "https://x.com/xspatrian",
  },
];

export const Members: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showMemberList, setShowMemberList] = useState(true);

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setShowMemberList(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-[calc(100vh-70px)]">
      <motion.div
        className={`w-full md:w-1/3 h-full sticky top-[70px] md:border-x border-zinc-300 overflow-y-auto ${
          showMemberList ? "block" : "hidden md:block"
        }`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col p-3 gap-2 ">
          <h2 className="text-lg font-semibold w-full text-zinc-700">
            Founding team
          </h2>
          {membersList.map((member, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors duration-300 ${
                selectedMember === member ? "bg-[#F6F7F9]" : "hover:bg-[#F6F7F9]"
              }`}
              onClick={() => handleMemberClick(member)}
            >
              <img
                src={member.profile}
                alt={member.name}
                className="w-16 h-16 md:w-16 md:h-16 rounded-full object-cover border-2 border-zinc-300"
              />
              <div>
                <h2 className="text-base md:text-lg font-semibold">
                  {member.name}
                </h2>
                <p className="text-xs md:text-sm text-zinc-600">
                  {member.role}
                </p>
              </div>
            </motion.div>
          ))}
          <hr />
          <h2 className="text-lg font-semibold w-full text-zinc-700">
            Other team
          </h2>
          <div className="p-3 w-full">
            <div className="w-full text-center p-2 text-zinc-600">No data</div>
          </div>
        </div>
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedMember ? selectedMember.name : "default"}
          className={`w-full md:w-2/3 p-5 justify-center ${
            showMemberList ? "hidden md:flex" : "flex"
          }`}
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.2 }}
        >
          {selectedMember ? (
            <motion.div
              className="w-full flex flex-col"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <button
                className="self-start md:hidden text-zinc-600 hover:text-zinc-800 w-full bg-zinc-100 p-2 flex items-center gap-2 text-lg"
                onClick={() => setShowMemberList(true)}
              >
                <ChevronLeft /> back
              </button>
              <div className="flex flex-col py-10 md:pt-0">
                <div className="flex gap-3">
                  <img
                    src={selectedMember.profile}
                    alt={selectedMember.name}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-zinc-300 shadow-lg"
                  />
                  <div className="flex flex-col items-start justify-center ">
                    <h1 className="text-xl md:text-2xl font-semibold text-center">
                      {selectedMember.name}
                    </h1>
                    <h2 className="text-lg md:text-xl text-zinc-600 text-center">
                      {selectedMember.role}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="w-full rounded-lg border border-zinc-800 bg-[#F6F7F9] p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">
                  About
                </h3>
                <p className="text-sm md:text-base text-zinc-700 whitespace-pre-line">
                  {selectedMember.about}
                </p>
              </div>
              <div className="px-4 py-6 md:px-6 md:py-8 flex flex-col gap-5">
                <div className="text-xl font-semibold">
                  Reach out to {selectedMember.name}
                </div>
                <div>
                  <ul className=" list-inside list-disc space-y-3 pb-5">
                    <li className="hover:underline flex gap-2 items-center w-full">
                      <LinkIcon className="w-[17px] h-[17px] text-neutral-500" />
                      <img
                        className="w-[25px] "
                        src="/github.png"
                        alt="github icon"
                      />
                      <a
                        target="_blanc"
                        href={selectedMember.profile.split(".png")[0]}
                      >
                        Github
                      </a>
                    </li>
                    <li className="hover:underline flex gap-2 items-center w-full">
                      <LinkIcon className="w-[17px] h-[17px] text-neutral-500" />
                      <img className="w-[25px] " src="/x.png" alt="x icon" />
                      <a target="_blanc" href={selectedMember.x}>
                        X (twitter)
                      </a>
                    </li>
                    <li className="hover:underline flex gap-2 items-center w-full">
                      <LinkIcon className="w-[17px] h-[17px] text-neutral-500" />
                      <img
                        className="w-[25px] "
                        src="/email.png"
                        alt="email icon"
                      />
                      <a href={`mailto:${selectedMember.email}`}>Email</a>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center w-full h-[220px] rounded-lg bg-[#F6F7F9] border border-zinc-800 p-5">
              <h1 className="text-3xl md:text-6xl font-semibold mb-4 text-[#20A0B5]">
                Together <br /> we built Find-X
              </h1>
              <p className="text-lg md:text-xl text-zinc-600">
                Select a team member to view their details
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

"use client"
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function TeamComponent() {
  const teamMembers = [
    {
      name: "Sahil Mulani",
      role: "Product Developer",
      image: "https://github.com/sahilm416.png",
    },
    {
      name: "Sohel Mujawar",
      role: "Data Scientist",
      image: "https://github.com/sohel1807.png",
    },
    {
      name: "Saad Momin",
      role: "Data Scientist",
      image: "https://github.com/saadmomin2903.png",
    },
    {
      name: "Suyog Patil",
      role: "Security Engineer",
      image: "https://github.com/xspatrian.png",
    },
  ];

  return (
    <div className="flex gap-10 flex-col py-5 text-[#f8f9f9]">
      <div>
        <h2 className="text-4xl text-center">
          <span>Building</span> <span className="gradient-text">Future</span>{" "}
          <span>Together</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {teamMembers.map((member, i) => (
          <Card key={i} className="group overflow-hidden border border-[#181818] bg-transparent">
            <CardContent className="p-3">
              <div className="relative w-full pb-[100%] bg-[#181818] rounded-md overflow-hidden">
                <ImageWithSkeleton src={member.image} alt={member.name} />
              </div>
              <div className="py-2">
                <p className='text-[#f7f8f8]'>{member.name}</p>
                <p className="text-[#656565]">{member.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ImageWithSkeleton({ src, alt }:{src: string, alt: string}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 bg-[#282828]" />
      )}
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
        className={`grayscale group-hover:grayscale-0 transition-all duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </>
  );
}
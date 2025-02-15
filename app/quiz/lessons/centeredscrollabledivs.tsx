"use client"

import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import { LockClosedIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";


export default function CenteredScrollableDivs({userLevel} : {userLevel: number}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerDivRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    // Scroll the 13th div to the center of the container
    if (centerDivRef.current && containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const centerDivHeight = centerDivRef.current.clientHeight;
      const scrollTo = centerDivRef.current.offsetTop - (containerHeight / 2) + (centerDivHeight / 2);
      containerRef.current.scrollTo({ top: scrollTo, behavior: 'auto' });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll border border-gray-300"
      style={{
        backgroundImage: "url('/wooden.jpg')", // Use the correct path to your image
      }}>

    
      {Array.from({ length: 500 }).map((_, index) => (
        
        <div
          key={index + 1}
          ref={index + 1 === userLevel ? centerDivRef : null}
          className={`
            h-[90px] w-[225px] flex items-center justify-center
            ${index + 1 === userLevel ? 'bg-customBlue text-white' : ((index + 1) < userLevel ? 'bg-customGreen' : 'bg-customRed')}
            border border-gray-200 rounded-lg shadow-md
            transition-all duration-300 ease-in-out
            hover:scale-105 hover:shadow-lg
            ${index + 1 === userLevel ? 'animate-pulse' : ''}
            mx-auto my-2
          `}
        >
          {((index + 1) < userLevel ? <CheckBadgeIcon height={35}/> : ((index + 1) === userLevel ? <Link href={`/quiz/lessons/${userLevel}`} className='p-5' ><p className='font-bold text-lg'>{index + 1}</p></Link> : <LockClosedIcon height={35} />))}
        </div>
      ))}
    </div>
  );
};


'use client'

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { LockClosedIcon, CheckBadgeIcon, TrophyIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { createClient } from "@/utils/supabase/client"
import { useSession } from "next-auth/react"

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerDivRef = useRef<HTMLDivElement>(null);
  const [userLevel, setUserLevel] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const { data: session } = useSession();
  const email = session?.user?.email;

  useEffect(() => {
    const fetchData = async () => {
      if (!email) return;
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('level')
          .eq('email', email)
          .single();

        if (data?.level) {
          setUserLevel(data.level);
        }
        if (error) {
          console.error('Error fetching user level:', error);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [email, supabase]);

  useEffect(() => {
    if (userLevel && centerDivRef.current && containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const centerDivHeight = centerDivRef.current.clientHeight;
      const scrollTo = centerDivRef.current.offsetTop - (containerHeight / 2) + (centerDivHeight / 2);
      containerRef.current.scrollTo({ top: scrollTo, behavior: 'smooth' });
    }
  }, [userLevel]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-amber-900 to-amber-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-300 mx-auto mb-4"></div>
          <p className="text-amber-100 text-lg font-medium">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll bg-gradient-to-b from-amber-900 to-amber-700"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-yellow-500"></div>
      <div className="absolute top-10 right-10">
        <SparklesIcon className="h-8 w-8 text-yellow-300 animate-pulse" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-100 mb-2 drop-shadow-lg">
            Journey Through Levels
          </h1>
          <p className="text-amber-200 max-w-md mx-auto">
            {userLevel > 1 ? (
              <>
                You&apos;ve mastered <span className="font-bold text-yellow-300">{userLevel - 1}</span> levels! Keep going!
              </>
            ) : (
              "Start your learning adventure!"
            )}
          </p>
        </div>
        
        {/* Progress indicator */}
        <div className="max-w-md mx-auto bg-amber-800 bg-opacity-50 rounded-full h-4 mb-8 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${Math.min(100, (userLevel / 500) * 100)}%` }}
          ></div>
        </div>

        {/* Levels grid */}
        <div className="max-w-sm mx-auto relative">
          {/* Current level indicator */}
          {userLevel > 1 && (
            <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 hidden md:block">
              <div className="bg-amber-600 text-white text-sm font-bold px-2 py-1 rounded rotate-90 whitespace-nowrap">
                CURRENT LEVEL
              </div>
              <div className="h-16 w-1 bg-amber-400 ml-2.5"></div>
            </div>
          )}

          <div className="space-y-4">
            {Array.from({ length: 500 }).map((_, index) => {
              const level = index + 1;
              const isCurrentLevel = level === userLevel;
              const isUnlocked = level <= userLevel;
              const isCompleted = level < userLevel;
              
              return (
                <div
                  key={level}
                  ref={isCurrentLevel ? centerDivRef : null}
                  className={`
                    relative group
                    h-28 w-full flex items-center justify-center
                    ${isCurrentLevel ? 
                      'bg-gradient-to-br from-yellow-400 to-amber-500 text-amber-900 shadow-lg' : 
                      isUnlocked ? 
                        'bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600' : 
                        'bg-gradient-to-br from-amber-800 to-amber-900 opacity-90'
                    }
                    border-2 ${isCurrentLevel ? 'border-yellow-300' : 'border-amber-700'}
                    rounded-xl shadow-lg
                    transition-all duration-300 ease-in-out
                    hover:scale-103 hover:shadow-xl
                    ${isCurrentLevel ? 'ring-4 ring-yellow-300 ring-opacity-50' : ''}
                    overflow-hidden
                  `}
                >
                  {/* Level card content */}
                  {isUnlocked ? (
                    <Link 
                      href={`/quiz/lessons/${level}`} 
                      className="w-full h-full flex items-center justify-center relative z-10"
                    >
                      {isCompleted ? (
                        <div className="text-center">
                          <CheckBadgeIcon className="h-12 w-12 text-yellow-300 mx-auto mb-1" />
                          <span className="text-xs text-amber-100 font-medium">LEVEL {level}</span>
                        </div>
                      ) : (
                        <div className="text-center transform group-hover:scale-110 transition-transform">
                          <span className="text-2xl font-bold block">{level}</span>
                          {isCurrentLevel && (
                            <span className="text-xs font-medium mt-1">CONTINUE</span>
                          )}
                        </div>
                      )}
                    </Link>
                  ) : (
                    <div className="text-center">
                      <LockClosedIcon className="h-10 w-10 text-amber-400 mx-auto" />
                      <span className="text-xs text-amber-200 font-medium mt-1">LOCKED</span>
                    </div>
                  )}

                  {/* Decorative elements */}
                  {isCurrentLevel && (
                    <>
                      <div className="absolute top-2 right-2">
                        <TrophyIcon className="h-6 w-6 text-amber-700" />
                      </div>
                      <div className="absolute -bottom-4 -right-4 h-16 w-16 bg-yellow-300 rounded-full opacity-20"></div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating action button */}
        {userLevel > 1 && (
          <div className="fixed bottom-20 right-3">
            <button 
              onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-amber-600 hover:bg-amber-500 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
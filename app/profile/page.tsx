// app/profile/page.tsx
"use client"; // Mark this as a Client Component

import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion"; // For animations

import { FaUser, FaTrophy } from "react-icons/fa"; // Icons
import { redirect } from "next/navigation";


import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Profile() {
  const { data: session } = useSession();

  const supabase = createClient()

  const email = session?.user?.email

  const [username, setUserName] = useState<string | null>(null)
  const [rank, setRank] = useState<string | null>(null)
  // const [email, setEmail] = useState<string | null>(null)

 
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('username, rank')
        .eq('email', email)

      if (data) {
        setRank(data[0].rank)
        setUserName(data[0].username)
      }
      if(error) {
        console.log(error)
      }
    }
    fetchUser()
  }, [supabase, email])


  // Check if session and session.user exist
  if (!session || !session.user) {
    redirect('/')
  }

  

  return (
    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 flex flex-col items-center justify-center p-4">
      {/* Profile Content */}
      <motion.div
        initial={{ opacity: 0, y: -50 }} // Initial animation state
        animate={{ opacity: 1, y: 0 }} // Animate to this state
        transition={{ duration: 0.5 }} // Animation duration
        className="w-full max-w-2xl text-center"
      >
        {/* Profile Picture */}
        <motion.img
          src={session.user.image || "/default-profile-picture.png"}
          alt="Profile Picture"
          className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white shadow-lg"
          whileHover={{ scale: 1.1 }} // Scale up on hover
          transition={{ type: "spring", stiffness: 300 }} // Spring animation
        />

        {/* Welcome Message */}
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome, {session.user.name ?? "Guest"}!
        </h1>

        {/* Username */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <FaUser className="text-white text-lg" />
          <p className="text-lg text-gray-200">@{username}</p>
        </div>

        {/* Rank */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <FaTrophy className="text-white text-lg" />
          <p className="text-lg text-gray-200">Rank: {rank}</p>
        </div>

        
        {/* Sign Out Button */}
        <button
          onClick={() => signOut()}
          className="block w-full sm:w-auto px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300"
        >
          Sign Out
        </button>
      </motion.div>
    </div>
  );
}
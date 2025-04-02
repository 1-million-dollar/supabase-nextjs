// app/quiz/page.tsx
"use client"; // Mark this as a Client Component

import Link from "next/link";
import { motion } from "framer-motion"; // For animations
import { FaBook, FaRocket, FaTrophy } from "react-icons/fa"; // Icons

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex flex-col items-center justify-center p-5">
      {/* Vocab Lessons Button */}
      <motion.div
        initial={{ opacity: 0, y: -50 }} // Initial animation state
        animate={{ opacity: 1, y: 0 }} // Animate to this state
        transition={{ duration: 0.5 }} // Animation duration
        className="w-full max-w-md mb-5"
      >
        <Link href="/quiz/lessons">
          <div className="flex justify-center items-center w-full h-16 gap-3 bg-green-400 text-black font-bold rounded-lg shadow-lg hover:bg-green-500 transition duration-300">
            <FaBook className="text-xl" /> {/* Icon */}
            <span>Vocab Lessons</span>
          </div>
        </Link>
      </motion.div>

      {/* Start a Rapid Quiz Button */}
      <motion.div
        initial={{ opacity: 0, y: -50 }} // Initial animation state
        animate={{ opacity: 1, y: 0 }} // Animate to this state
        transition={{ duration: 0.5, delay: 0.2 }} // Animation duration with delay
        className="w-full max-w-md mb-5"
      >
        <Link href="/quiz/rapid">
          <div className="flex justify-center items-center w-full h-16 gap-3 bg-yellow-400 text-black font-bold rounded-lg shadow-lg hover:bg-yellow-500 transition duration-300">
            <FaRocket className="text-xl" /> {/* Icon */}
            <span>Start a Rapid Quiz</span>
          </div>
        </Link>
      </motion.div>

      {/* Leaderboard Button (Optional) */}
      <motion.div
        initial={{ opacity: 0, y: -50 }} // Initial animation state
        animate={{ opacity: 1, y: 0 }} // Animate to this state
        transition={{ duration: 0.5, delay: 0.4 }} // Animation duration with delay
        className="w-full max-w-md"
      >
        <Link href="/quiz/leaderboard">
          <div className="flex justify-center items-center w-full h-16 gap-3 bg-red-400 text-black font-bold rounded-lg shadow-lg hover:bg-red-500 transition duration-300">
            <FaTrophy className="text-xl" /> {/* Icon */}
            <span>Leaderboard</span>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
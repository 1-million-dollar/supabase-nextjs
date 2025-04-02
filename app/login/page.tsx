// app/page.tsx
"use client"; // Mark this as a Client Component

import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Page() {
  const { data: session } = useSession();

  if (session) {
    redirect("/home"); // Redirect to /home if the user is signed in
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 to-indigo-600 flex flex-col items-center justify-center p-4">
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: -50 }} // Initial animation state
        animate={{ opacity: 1, y: 0 }} // Animate to this state
        transition={{ duration: 0.5 }} // Animation duration
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Welcome to <b>VocabTrivia</b></h1>
        <p className="text-lg text-gray-200">Sign in to get started</p>
      </motion.div>

      {/* Sign in with Google Button */}
      <motion.div
        initial={{ opacity: 0, y: 50 }} // Initial animation state
        animate={{ opacity: 1, y: 0 }} // Animate to this state
        transition={{ duration: 0.5, delay: 0.2 }} // Animation duration with delay
      >
        <button
          className="flex items-center justify-center px-6 py-3 space-x-3 bg-white border border-gray-300 rounded-lg shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => signIn("google")}
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z"
              fill="#4285F4"
            />
            <path
              d="M12 23C14.97 23 17.46 21.99 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.64 12 18.64C9.14 18.64 6.71 16.68 5.84 14.07H2.18V16.94C4.01 20.53 7.71 23 12 23Z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.07C5.62 13.43 5.49 12.76 5.49 12.07C5.49 11.38 5.62 10.71 5.84 10.07V7.2H2.18C1.43 8.52 1 10.03 1 11.57C1 13.11 1.43 14.62 2.18 15.94L5.84 14.07Z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.71 1 4.01 3.47 2.18 7.06L5.84 9.93C6.71 7.32 9.14 5.38 12 5.38Z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-lg font-medium text-gray-700">
            Sign in with Google
          </span>
        </button>
      </motion.div>
    </div>
  );
}
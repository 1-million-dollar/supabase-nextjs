import { useEffect } from "react";
import { FaTrophy } from "react-icons/fa";
import ReactConfetti from "react-confetti";// Import using ES modules

export default function YouWon() {
  // Play sound effect and trigger confetti
  

  return (
    <div className="flex flex-col items-center justify-center min-h-[30vh] min-w-[30vh] bg-green-50">
      {/* Confetti Canvas */}
      <ReactConfetti />
      <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg text-center">
        <FaTrophy className="text-5xl mx-auto mb-4" />
        <h2 className="text-3xl font-bold">You Won!</h2>
      </div>
    </div>
  );
}
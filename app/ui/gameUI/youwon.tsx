import { useEffect } from "react";
import { FaTrophy } from "react-icons/fa";

export default function YouWon() {
  // Play sound effect and trigger confetti
  useEffect(() => {
  

    // Confetti effect
    const confetti = require("canvas-confetti");
    confetti.create(document.getElementById("canvas"), {
      resize: true,
      useWorker: true,
    })({ particleCount: 200, spread: 160 });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[30vh] min-w-[30vh] bg-green-50">
      {/* Confetti Canvas */}
      <canvas id="canvas" className="fixed top-0 left-0 w-full h-full pointer-events-none"></canvas>

      <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg text-center">
        <FaTrophy className="text-5xl mx-auto mb-4" />
        <h2 className="text-3xl font-bold">You Won!</h2>
      </div>
    </div>
  );
}
import { useEffect } from "react";
import { FaHandshake } from "react-icons/fa";

export default function Draw() {
  // Play sound effect


  return (
    <div className="flex flex-col items-center justify-center min-h-[30vh] min-w-[30vh] bg-yellow-50">
      <div className="bg-yellow-500 text-black p-6 rounded-lg shadow-lg text-center">
        <FaHandshake className="text-5xl mx-auto mb-4" />
        <h2 className="text-3xl font-bold">Draw</h2>
        
      </div>
    </div>
  );
}
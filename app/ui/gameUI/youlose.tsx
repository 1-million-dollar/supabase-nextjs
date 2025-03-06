
import { FaSadTear } from "react-icons/fa";

export default function YouLose() {
  // Play sound effect
  

  return (
    <div className="flex flex-col items-center justify-center min-h-[30vh] min-w-[30vh] bg-red-50">
      <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg text-center">
        <FaSadTear className="text-5xl mx-auto mb-4" />
        <h2 className="text-3xl font-bold">You Lose!</h2>
       
      </div>
    </div>
  );
}
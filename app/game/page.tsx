"use client"; // Mark this as a Client Component

import { useState, useEffect } from "react";
import { ref, set, update } from "firebase/database";
import { database } from "../lib/firebase";
import { redirect } from "next/navigation";

import { gameWords } from "../lib/values"





import { createClient } from "@/utils/supabase/client";

import { useSession, signOut } from "next-auth/react";


export default function Page() {

  const { data: session } = useSession()
 
  const [username, setUserName] = useState<string | null>(null);

  const supabase = createClient()

  function shuffleArray(array: { word: string; meaning: string; }[]) {
    // Create a copy of the original array to avoid mutating it directly
    const shuffled = [...array];
    
    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    
    return shuffled;
  }
  
  // Usage example:
  const shuffledWords = shuffleArray(gameWords);
  console.log(shuffledWords); // Randomly shuffled array

// Select 6 random words

const selectedWords: { word: string; meaning: string }[] = shuffledWords.slice(0, 6);
// Result: Array of 6 objects like { word: "...", meaning: "..." }

// Add the selected words to another array
const newArray: { word: string; meaning: string }[] = [];
newArray.push(...selectedWords); // Works! (same type)
console.log("Selected words:", newArray);

 

  const generateGameId = () => {
    const newGameId = Math.random().toString(36).substring(2, 8);
    console.log("Generated Game ID:", newGameId); // Debug log
    return newGameId;
  };

  // Player 1 creates a new game
  const createGame = () => {
    const newGameId = generateGameId();
   
    console.log("Creating game with ID:", newGameId); // Debug log

    // randomly generate turn
    const randomBoolean = (): boolean => {
      return Math.random() >= 0.5;
    };

    // Initialize the game in Firebase
    set(ref(database, `games/${newGameId}`), {
      player1_score: 0,
      player2_score: 0,
      player1_username: username,
      player2_username: "",
      time_left: 30,
      word: "",
      meaning: "",
      is_word: false,
      sentence: "",
      is_sentence: false,
      result: null,
      is_result: false,
      player1_turn: randomBoolean(),
      status: "waiting",
      message: "",
      words: newArray,
    })
      .then(() => {
        console.log("Game created successfully in Firebase."); // Debug log
      })
      .catch((error) => {
        console.error("Error creating game in Firebase:", error); // Debug log
      });

      redirect(`/game/${newGameId}`)
  };

  // Player 2 joins an existing game
  const joinGame = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const gameId = formData.get("game") as string;
    
    console.log("Joining game with ID:", gameId); // Debug log


    // Update Play started in Firebase
    const updateGame = async (gameId: string) => {
      const updates = {
        "player2_username": username, // Update player1_turn
        "status": "playing", // Update status
      };
    
      try {
        await update(ref(database, `games/${gameId}`), updates);
        console.log("Game updated successfully.");
      } catch (error) {
        console.error("Error updating game:", error);
      }
    };

    updateGame(gameId)

    redirect(`/game/${gameId}`)
  };

  // Listen for real-time updates
   
  

  
  
  // get user name
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('email', session?.user?.email)
        .single(); // Use .single() if you expect only one row

      if (error) {
        console.log(error)
      } else {
       setUserName(data.username)
       console.log(username)
      }
    };

    fetchUser();
  }, [supabase]);

  

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-6">
  {/* Search Box at the Top (visual only) */}
  <div className="w-full max-w-md mb-6">
    <div className="relative">
      <input
        type="text"
        placeholder="Search for users..."
        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
        disabled
      />
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
      </svg>
    </div>
  </div>

  {/* Header */}
  <div className="text-center mb-8">
    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
      SayIt
    </h1>
    
  </div>

  {/* Main card */}
  <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg w-full max-w-md border border-white/20">
    {/* Create Game Button */}
    <button
      onClick={createGame}
      className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md hover:shadow-lg mb-6"
    >
      Create New Game
    </button>

    {/* Divider */}
    <div className="relative mb-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200"></div>
      </div>
      <div className="relative flex justify-center">
        <span className="px-3 bg-white text-gray-500 text-sm">OR</span>
      </div>
    </div>

    {/* Join Game Form */}
    <form onSubmit={joinGame} className="space-y-4">
      <div>
        <input
          type="text"
          name="game"
          placeholder="Enter Game ID"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg"
      >
        Join Game
      </button>
    </form>
  </div>
</div>
  );
}
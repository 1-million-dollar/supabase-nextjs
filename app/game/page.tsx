"use client"; // Mark this as a Client Component

import { useState, useEffect } from "react";
import { ref, set, update } from "firebase/database";
import { database } from "../lib/firebase";
import { redirect } from "next/navigation";
import { wordsArray } from "../lib/values";

import { useUser } from "../context/UserContext";

import { createClient } from "@/utils/supabase/client";


export default function Page() {
 

 
  
  const [username, setUserName] = useState<string | null>(null);
  
  const { userId } = useUser();

  const supabase = createClient()

  // Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array: string[]): string[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

// Select 6 random words
const shuffledWords = shuffleArray([...wordsArray]); // Shuffle a copy of the array
const selectedWords: string[] = shuffledWords.slice(0, 6); // Get the first 6 words

// Add the selected words to another array
const newArray: string[] = [];
newArray.push(...selectedWords);

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
      player1_time: 0,
      player2_time: 0,
      word: "",
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
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single(); // Use .single() if you expect only one row

      if (error) {
        console.log(error)
      } else {
       setUserName(data.username)
      }
    };

    fetchProfile();
  }, [userId, supabase]);

  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">SayIt</h1>
      
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <button
            onClick={createGame}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors mb-4"
          >
            Create New Game
          </button>
          <div>
            <form onSubmit={joinGame} className="flex flex-col space-y-4">
              <input
                type="text"
                name="game"
                placeholder="Enter Game ID"
                
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
              >
                Join Game
              </button>
            </form>
          </div>
        </div>
      
    </div>
  );
}
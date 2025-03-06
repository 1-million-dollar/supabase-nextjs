"use client"

import React, { useEffect } from "react";
import Link from "next/link";
import { useState } from "react";
import { ref, onValue, update } from "firebase/database";
import { database } from "@/app/lib/firebase";

import { useUser } from "@/app/context/UserContext";

import { createClient } from "@/utils/supabase/client";

import YouWon from "@/app/ui/gameUI/youwon";
import YouLose from "@/app/ui/gameUI/youlose";
import Draw from "@/app/ui/gameUI/draw";


type Params = {
  gameId: string;
};


export default function Page({ params }: { params: Promise<Params> }) {

  const { gameId } = React.use(params);

  const [P1user, setP1User] = useState<string | null>(null);
  const [P2user, setP2User] = useState<string | null>(null);
  const [isP1turn, setP1turn] = useState(false)

  const [username, setUserName] = useState<string | null>(null);
  const [word, setWord] = useState<string>("");
  const [sentence, setSentence] = useState<string>("");
  const [isWord, setIsword] = useState(false)
  const [isSentence, setIsSentence] = useState(false)
  const [result, setResult] = useState<boolean | null>(null);
  const [isResult, setIsresult] = useState<boolean | null>(null);
  const [P1score, setP1score] = useState(0)
  const [P2score, setP2score] = useState(0)
  const [words, setWords] = useState([])
  const [status, setStatus] = useState("")



  const { userId } = useUser();

  const supabase = createClient()

  // set word in the database
  const handleSetWord = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const word = formData.get("word") as string;

    

    const updateGame = async (gameId: string) => {
          const updates = {
            "word": word, // Update player1_turn
            "is_word": true, // There is a word
            "sentence": "", // new sentence to be entered
            "result": null, // new result to be displayed
            "status": "playing", // Update status
            "is_sentence": false, // No new sentence entered
            "is_result": false, // There is no result
          };
        
          try {
            await update(ref(database, `games/${gameId}`), updates);
            console.log("Game updated successfully.");
          } catch (error) {
            console.error("Error updating game:", error);
          }
        };
    updateGame(gameId)
  }

  const handleSentence = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const sentence = formData.get("sentence") as string;

    const newWords = words.filter(w => w !== word);

    const regex = new RegExp(`\\b${word}\\b`, "i");
    if (regex.test(sentence)) {
      // Update the game state in Firebase
    const updateGame = async (gameId: string) => {
      const updates = {
        "sentence": sentence, // Update sentence
        "is_sentence": true, // There is a sentence
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

    // function to check if the entered sentence is grammatically correct
const checkSentence = async () => {
  if (!sentence.trim()) {
    alert("Please enter a sentence.");
    return;
  }

try {
    const response = await fetch("/api/check-sentence", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sentence }),
    });

    const data = await response.json();
    console.log(data?.isCorrect)

    if(data?.isCorrect) {
       // update data in firebase
    const updateGame = async (gameId: string) => {
      const updates = {
        "is_result": true, // There is a result
        "result": true, // Update result
        "is_word": false, //user can enter next word
        "words": newWords, // update new words in database
        "player1_score": !isP1turn ? P1score + 1 : P1score, // Update player1 score
        "player2_score": !isP1turn ? P2score : P2score + 1, // Update player2 score
        "player1_turn": !isP1turn, // Change P1 turn
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


    } else {
       // update data in firebase
    const updateGame = async (gameId: string) => {
      const updates = {
        "is_result": true, // There is a result
        "result": false, // Update result
        "is_word": false, // user can enter next word
        "words": newWords, // update new words in database
        "player1_turn": !isP1turn, // Change P1 turn
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

    
  }

  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while checking the sentence.");
  } finally {
  }
};

    
    checkSentence();

    } else {
      console.log("The word is not in the sentence.");
      
    }
  };

  if(!words) {

      
    // update game state in firebase
    const updateGame = async (gameId: string) => {
      const updates = {
        "status": "finished", // Update status
      };
    
      try {
        await update(ref(database, `games/${gameId}`), updates);
        console.log("Game updated successfully.");
      } catch (error) {
        console.error("Error updating game:", error);
      }
    };
    updateGame(gameId)
    }





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

  // Listen for real-time updates
  useEffect(() => {
    if (gameId) {
      const gameRef = ref(database, `games/${gameId}`);
      onValue(gameRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          console.log("Game data from Firebase:", data); // Debug log
          setP1User(data.player1_username)
          setP2User(data.player2_username)
          setP1turn(data.player1_turn)
          setWord(data.word)
          setIsword(data.is_word)
          setSentence(data.sentence)
          setIsSentence(data.is_sentence)
          setResult(data.result)
          setP1score(data.player1_score)
          setP2score(data.player2_score)
          setIsresult(data.is_result)
          setWords(data.words)
          setStatus(data.status)
          
        }
      });
    }
  }, [gameId]);

  

  

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Score Section */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center mb-4 sm:mb-8 w-full max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Score</h2>
        {username === P1user ? (
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-600">{P2score} : {P1score}</h1>
        ) : (
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-600">{P1score} : {P2score}</h1>
        )}
      
      </div>

      {/* Game Container */}
      <div className="bg-white p-4 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-y-auto">
        {/* Player Joined Section */}
        <div className="bg-purple-100 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                P1
              </div>
              <div className="text-base sm:text-lg font-semibold text-purple-800">
                {(username === P1user ) ? P2user : P1user}
              </div>
            </div>
            <div className="text-base sm:text-lg font-bold text-purple-800">
              0:00
            </div>
          </div>
        </div>

        
        {status === "finished" ? (
          <div className="flex flex-col items-center justify-center">
            {username === P1user ? (P1score > P2score ? <YouWon /> : (P2score > P1score ? <YouLose /> : <Draw />)) : (P2score > P1score ? <YouWon /> : (P1score > P2score ? <YouLose /> : <Draw />))}
            <div className="mt-2 space-x-4 mb-4">
          <Link href={'/game'}>
            <button
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
            >
              New Game
            </button>
          </Link>
          <Link href={'/game'}>
            <button
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Rematch
            </button>
          </Link>
          
        </div>
          </div>

        ) : (
          <div>
            {!((isP1turn && !(username === P1user)) || (!isP1turn && username === P1user)) ? (
        <div>
          {/* Player 1 Section */}
          <div className="bg-blue-100 p-2 sm:p-4 rounded-lg mb-4 sm:mb-6">
            <div>
              <form onSubmit={handleSetWord} className="flex flex-col items-center space-y-4">
              <select name="word" className="w-full p-2 sm:p-3 rounded-md border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base">
              {words ? (
                words.map((word, index) => (
                  <option key={index} value={word}>
                    {word}
                  </option>
                ))
              ) : <option>no option</option>
              }
              </select>
              <button type="submit" 
                      className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors text-sm sm:text-base whitespace-nowrap"
                      disabled={isWord}>
                Set Word
              </button>
              </form>
            </div>
          </div>

          {/* Player 2 Section */}
          <div className="bg-green-100 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6 space-y-4">
            <div>{isWord ? <b>{word}</b> : "Waiting..."} </div>
            <div>{isSentence ? <b>{sentence}</b> : ""}</div>
            <div>
              {isResult ? (
                result ? (
                  <p className="text-green-600 font-semibold">✅ The sentence is correct!</p>
                    ) : (
                  <p className="text-red-600 font-semibold">❌ The sentence has errors:</p>
                  )
              ) : ""}
              
            </div>
          </div>
        </div>
        ) : (
          <div>
           {/* Player 1 Section */}
           <div className="bg-green-100 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6 space-y-4">
          <div>{isWord ? <b>{word}</b> : "Waiting..."} </div>
          <div>{isSentence ? <b>{sentence}</b> : ""}</div>
          <div>
            {isResult ? (
              result ? (
                <p className="text-green-600 font-semibold">✅ The sentence is correct!</p>
                  ) : (
                <p className="text-red-600 font-semibold">❌ The sentence has errors:</p>
                )
            ) : ""}
            
          </div>
        </div>
         {/* Player 2 Section */}
        <div>
          <form onSubmit={handleSentence} className="bg-green-100 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
            <textarea
              name="sentence"
              rows={5}
              className="w-full p-2 sm:p-3 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              placeholder="Type your sentence here..."
            />
            <button className="w-full mt-2 sm:mt-4 bg-green-500 text-white py-1 sm:py-2 px-3 sm:px-4 rounded-md hover:bg-green-600 transition-colors text-sm sm:text-base"
                    disabled={isSentence}>
              Check
            </button>
          </form>
        </div>
        </div>
      )}
          </div>
        )}
        

        

        {/* User Profile Section */}
        <div className="bg-orange-100 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                P2
              </div>
              <div className="text-base sm:text-lg font-semibold text-orange-800">
                {username}
              </div>
            </div>
            <div className="text-base sm:text-lg font-bold text-orange-800">
              0:00
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



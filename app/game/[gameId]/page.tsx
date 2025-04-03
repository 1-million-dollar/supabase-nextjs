"use client"

import React, { useEffect } from "react";
import Link from "next/link";
import { useState } from "react";
import { ref, onValue, update } from "firebase/database";
import { database } from "@/app/lib/firebase";


import { createClient } from "@/utils/supabase/client";

import { useSession } from "next-auth/react";

import YouWon from "@/app/ui/gameUI/youwon";
import YouLose from "@/app/ui/gameUI/youlose";
import Draw from "@/app/ui/gameUI/draw";


type Params = {
  gameId: string;
};

type WordItem = {
  word: string;
  meaning: string;
};

interface Error {
  message: string;
  context: { text: string };
  suggestions: string[];
}


export default function Page({ params }: { params: Promise<Params> }) {

  const { gameId } = React.use(params);

  const { data: session } = useSession()

  const [P1user, setP1User] = useState<string | null>(null);
  const [P2user, setP2User] = useState<string | null>(null);
  const [isP1turn, setP1turn] = useState(false)

  const [username, setUserName] = useState<string | null>(null);
  const [word, setWord] = useState<string>("");
  const [sentence, setSentence] = useState<string>("");
  const [isWord, setIsword] = useState(false)
  const [isSentence, setIsSentence] = useState(false)
  const [result, setResult] = useState<{
      isCorrect: boolean;
      errors?: Error[];
    } | null>(null);
  const [isResult, setIsresult] = useState<boolean | null>(null);
  const [P1score, setP1score] = useState(0)
  const [P2score, setP2score] = useState(0)
  const [words, setWords] = useState<WordItem[]>([]);
  const [status, setStatus] = useState("")
  const [meaning, setMeaning] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(30)
  


  const supabase = createClient()

  // set word in the database
  const handleSetWord = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const word = formData.get("word") as string;

    function getMeaning(targetWord : string) {
      const foundWord = words.find(item => item.word === targetWord);
      return foundWord ? foundWord.meaning : 'Word not found';
    }

    

    const updateGame = async (gameId: string) => {
          const updates = {
            "word": word, // Update player1_turn
            "meaning": getMeaning(word), //update the meaning of the word
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
    const removeWord = (wordList: WordItem[], targetWord: string): WordItem[] => {
      return wordList.filter(item => item.word !== targetWord);
    };
    
    // Usage:
    const newWords = removeWord(words, word);
    

    const regex = new RegExp(`\\b${word}\\b`, "i");
    if (regex.test(sentence)) {
      // Update the game state in Firebase
    const updateGame = async (gameId: string) => {
      const updates = {
        "sentence": sentence, // Update sentence
        "is_sentence": true, // There is a sentence
        "time_left": 30, //reset time
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
        "result": data, // Update result
        "is_word": false, //user can enter next word
        "words": newWords, // update new words in database
        "player1_score": !isP1turn ? P1score + 1 : P1score, // Update player1 score
        "player2_score": !isP1turn ? P2score : P2score + 1, // Update player2 score
        "player1_turn": !isP1turn, // Change P1 turn
        "time_left": 30,
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
        "result": data, // Update result
        "is_word": false, // user can enter next word
        "words": newWords, // update new words in database
        "player1_turn": !isP1turn, // Change P1 turn
        "time_left": 30,
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
      alert("The word is not in the sentence.")
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



  // the timer
  useEffect(() => {
    if (timeLeft > 0 && !isSentence && isWord) {
      const timer = setTimeout(() => setTimeLeft(timeLeft -1), 1000)

      // update data in firebase
    const updateGame = async (gameId: string) => {
      const updates = {
        "time_left": timeLeft,
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
      console.log(timeLeft)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isSentence && isWord) {
      setTimeLeft(30)
      const removeWord = (wordList: WordItem[], targetWord: string): WordItem[] => {
        return wordList.filter(item => item.word !== targetWord);
      };
      
      // Usage:
      const newWords = removeWord(words, word);

      // update data in firebase
    const updateGame = async (gameId: string) => {
      const updates = {
        "is_word": false, // user can enter next word
        "words": newWords, // update new words in database
        "time_left": 30,
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
  }, [timeLeft, isSentence, isWord])



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
      }
    };

    fetchUser();
  }, [supabase]);

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
          setMeaning(data.meaning)
          setResult(data.result)
          setTimeLeft(data.time_left)

          
          
        }
      });
    }
  }, [gameId]);

  

  

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Game Id section */}
      <div 
  className="group relative bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full inline-flex items-center hover:bg-indigo-200 transition-colors cursor-pointer"
  onClick={() => navigator.clipboard.writeText(gameId)}
>
  <span className="mr-1">Game ID:</span>
  <span className="font-mono font-bold">{gameId}</span>
  
  {/* Copy indicator that appears on hover */}
  <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-indigo-500 flex items-center">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-3 w-3 mr-1" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" 
      />
    </svg>
    Copy
  </span>
  
  {/* Tooltip confirmation */}
  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
    Copied!
    <svg 
      className="absolute text-gray-800 h-2 w-full left-0 top-full" 
      x="0px" 
      y="0px" 
      viewBox="0 0 255 255" 
    >
      <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
    </svg>
  </span>
</div>
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
              0:{username !== P1user ? isP1turn ? timeLeft : "00" : isP1turn ? "00" : timeLeft}
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
                words.map((item, index) => (
                  <option key={index} value={item.word}>
                    {item.word}
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
            <div>{isWord ? <p><b>{word} </b>: {meaning}</p> : "Waiting..."} </div>
            <div>{isSentence ? <b>{sentence}</b> : ""}</div>
            <div>
              {isResult ? (
                result && (
                  <div className="mt-6 w-full max-w-md">
                    {result.isCorrect ? (
                      <p className="text-green-600 font-semibold">✅ The sentence is correct!</p>
                    ) : (
                      <div>
                        <p className="text-red-600 font-semibold">❌ The sentence has errors:</p>
                        <ul className="mt-2">
                          {result.errors?.map((error, index) => (
                            <li key={index} className="mb-2">
                              <p className="text-gray-700">{error.message}</p>
                              <p className="text-gray-500">Context: {error.context.text}</p>
                              <p className="text-gray-500">
                                Suggestions: {error.suggestions.join(', ')}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              ) : ""}
              
            </div>
          </div>
        </div>
        ) : (
          <div>
           {/* Player 1 Section */}
           <div className="bg-green-100 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6 space-y-4">
          <div>{isWord ? <p><b>{word} </b>: {meaning}</p> : "Waiting..."} </div>
          <div>{isSentence ? <b>{sentence}</b> : ""}</div>
          <div>
          {isResult ? (
                result && (
                  <div className="mt-6 w-full max-w-md">
                    {result.isCorrect ? (
                      <p className="text-green-600 font-semibold">✅ The sentence is correct!</p>
                    ) : (
                      <div>
                        <p className="text-red-600 font-semibold">❌ The sentence has errors:</p>
                        <ul className="mt-2">
                          {result.errors?.map((error, index) => (
                            <li key={index} className="mb-2">
                              <p className="text-gray-700">{error.message}</p>
                              <p className="text-gray-500">Context: {error.context.text}</p>
                              <p className="text-gray-500">
                                Suggestions: {error.suggestions.join(', ')}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
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
              0:{username === P1user ? isP1turn ? timeLeft : "00" : isP1turn ? "00" : timeLeft}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



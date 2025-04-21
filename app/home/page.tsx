'use client'

// pages/dictionary.tsx
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Link from 'next/link';

import { addSearchedWord, getQuestionId } from '../lib/data';

import { createClient } from '@/utils/supabase/client';

import { useSession } from "next-auth/react";


// Types (same as before)
interface Definition {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

interface Phonetic {
  text?: string;
  audio?: string;
}

interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  origin?: string;
  meanings: Meaning[];
}

export default function Page() {
  const [word, setWord] = useState('');
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [id, setId] = useState<number | null>(null)

  let email: string | null | undefined

  const supabase = createClient()

  const { data: session } = useSession();

  const fetchDefinition = async () => {
    if (!word.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      
      if (!response.ok) {
        throw new Error('Word not found');
      }

      if(response.ok) {
        // check for repeated data and insert new data

    fetchData().then(() => {
      console.log("email before checking", email);
      
      if (id == 0) {
        addSearchedWord(word).then(() => {
          console.log("Data inserted successfully");
        });
      }
      
      if (email === session?.user?.email) {
        console.log('Duplicate found. Record already exists.');
      } else {
        insertData();
      }
    }).catch(error => {
      console.error("Error:", error);
    });
      }
     
      
      const data: DictionaryEntry[] = await response.json();
      
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    const id = await getQuestionId(word)
    console.log(id)
    setId(id)

    const { data, error } = await supabase
      .from('new_words')
      .select('email')
      .ilike('word', word)

    if (data) {
      email = (data[0]?.email)
      console.log("email after fetch", email)
    }
    if (error) {
      console.log(error)
    }
  }

  const insertData = async () => {
    const {data, error} = await supabase
      .from('new_words')
      .insert([{email: session?.user?.email, word: word}])

    if (data) {
      console.log("new record inserted")
    }
    if (error) {
      console.log(error)
    }
  }

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDefinition();
  
   
    
    
  }
  
  
  

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  
  
  

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
    

      <audio ref={audioRef} className="hidden" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
      
      



<motion.form
  onSubmit={async (e) => {
    e.preventDefault();
    await handleSubmit(e);
    setWord("");
  }}
  className="mb-12 w-full px-4"
  whileHover={{ scale: 1.01 }}
>
  <div className="flex gap-2 shadow-lg rounded-full overflow-hidden w-full">
    <input
      type="text"
      value={word}
      onChange={(e) => setWord(e.target.value)}
      placeholder="Search any word..."
      className="flex-1 min-w-0 p-3 sm:p-4 text-base sm:text-lg border-0 focus:ring-2 focus:ring-purple-500 focus:outline-none rounded-l-full"
    />
    <button
      type="submit"
      disabled={loading || !word.trim()}
      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 sm:px-6 text-base sm:text-lg font-medium rounded-r-full transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
    >
      {loading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Searching
        </span>
      ) : 'Search'}
    </button>
  </div>
</motion.form>


        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-lg shadow-sm"
            >
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {entries.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              {entries.map((entry, entryIndex) => (
                <motion.div
                  key={entryIndex}
                  variants={itemVariants}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <motion.h2 
                          className="text-3xl font-bold text-gray-900 mb-1"
                          initial={{ x: -20 }}
                          animate={{ x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          {entry.word}
                        </motion.h2>
                        {entry.phonetic && (
                          <p className="text-purple-600 text-lg">{entry.phonetic}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {entry.phonetics.map((phonetic, idx) => (
                          phonetic.audio && (
                            <motion.button
                              key={idx}
                              onClick={() => playAudio(phonetic.audio!)}
                              className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 rounded-full shadow-sm"
                              title="Play pronunciation"
                              whileTap={{ scale: 0.9 }}
                              whileHover={{ scale: 1.1 }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            </motion.button>
                          )
                        ))}
                      </div>
                    </div>
                    
                    {entry.meanings.map((meaning, meaningIndex) => (
                      <motion.div 
                        key={meaningIndex}
                        className="mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: meaningIndex * 0.1 }}
                      >
                        <div className="flex items-center mb-4">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-3">
                            {meaning.partOfSpeech}
                          </span>
                          <div className="h-px flex-1 bg-gradient-to-r from-blue-100 to-purple-100"></div>
                        </div>
                        
                        <div className="mb-6">
                          <h4 className="font-medium text-lg mb-3 text-gray-800">Definitions</h4>
                          <ul className="space-y-4">
                            {meaning.definitions.slice(0, 5).map((def, defIndex) => (
                              <motion.li 
                                key={defIndex}
                                className="pl-4 border-l-4 border-blue-200"
                                whileHover={{ x: 5 }}
                              >
                                <p className="text-gray-700">{def.definition}</p>
                                {def.example && (
                                  <p className="text-gray-500 italic mt-2 pl-2 border-l-2 border-purple-200">
                                    &quot;{def.example}&quot;
                                  </p>
                                )}
                              </motion.li>
                            ))}
                          </ul>
                        </div>

                        {meaning.synonyms.length > 0 && (
                          <motion.div 
                            className="mb-6"
                            initial={{ x: -20 }}
                            animate={{ x: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <h4 className="font-medium text-lg mb-2 text-gray-800">Synonyms</h4>
                            <div className="flex flex-wrap gap-2">
                              {meaning.synonyms.map((synonym, idx) => (
                                <motion.span 
                                  key={idx}
                                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:bg-green-200 transition-colors"
                                  onClick={() => setWord(synonym)}
                                  whileHover={{ y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {synonym}
                                </motion.span>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {meaning.antonyms.length > 0 && (
                          <motion.div
                            className="mb-6"
                            initial={{ x: -20 }}
                            animate={{ x: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <h4 className="font-medium text-lg mb-2 text-gray-800">Antonyms</h4>
                            <div className="flex flex-wrap gap-2">
                              {meaning.antonyms.map((antonym, idx) => (
                                <motion.span
                                  key={idx}
                                  className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:bg-red-200 transition-colors"
                                  onClick={() => setWord(antonym)}
                                  whileHover={{ y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {antonym}
                                </motion.span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex flex-col gap-4 p-4">
  {/* Continue Lessons Card */}
  <Link href='/quiz/lessons'>
    <div className="bg-gradient-to-r from-[#6E45E2] to-[#89D4CF] rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 text-white w-full">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold">Lessons</h3>
            <p className="text-sm opacity-90 mt-1">Resume your learning journey</p>
          </div>
        </div>
      </div>
  </Link>
    
 
  

  {/* Revise Words Card */}
  <Link href='/quiz/review'>
    <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 text-white w-full">
      <div className="flex items-center gap-4">
        <div className="bg-white/20 p-3 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-9h6" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold">Revise</h3>
          <p className="text-sm opacity-90 mt-1">Strengthen your word knowledge</p>
        </div>
      </div>
    </div>
  </Link>
  

  {/* Vocab Quiz Card */}
  <Link href='/quiz/rapid'>
    <div className="bg-gradient-to-r from-[#4ECDC4] to-[#2B8BBA] rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 text-white w-full">
      <div className="flex items-center gap-4">
        <div className="bg-white/20 p-3 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold">Quiz</h3>
          <p className="text-sm opacity-90 mt-1">Test your language skills</p>
        </div>
      </div>
    </div>
  </Link>
  

  {/* Play Card */}
  <Link href='/game'>
    <div className="bg-gradient-to-r from-[#FF9A8B] to-[#FF6B95] rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 text-white w-full">
      <div className="flex items-center gap-4">
        <div className="bg-white/20 p-3 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold">Play</h3>
          <p className="text-sm opacity-90 mt-1">Learn through play</p>
        </div>
      </div>
    </div>
  </Link>
  
</div>
        <div>leaderboard</div>
      </motion.div>
    </div>
  );
}
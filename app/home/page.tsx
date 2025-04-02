'use client'

// pages/dictionary.tsx
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { FaBook, FaGamepad } from 'react-icons/fa';
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
  const [email, setEmail] = useState<string | null>(null)
  const [id, setId] = useState<number | null>(null)

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
      
      const data: DictionaryEntry[] = await response.json();
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDefinition();
    fetchData()

    if(id == 0) {
      addSearchedWord(word)
      console.log("Data inserted successfully")
    }
    if (email === session?.user?.email) {
      console.log('Duplicate found. Record already exists.');
  
    } else {
      insertData()
    }
  };

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

  
  const fetchData = async () => {
    const id = await getQuestionId(word)
    setId(id)

    const { data, error } = await supabase
      .from('new_words')
      .select('email')
      .eq('word', word)

    if (data) {
      setEmail(data[0]?.email)
    }
    if (error) {
      console.log(error)
    }
  }
  

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <Head>
        <title>Linguo - Modern Dictionary App</title>
        <meta name="description" content="Beautiful dictionary application with animations" />
      </Head>

      <audio ref={audioRef} className="hidden" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex flex-row items-center justify-center mb-16 p-4 h-min bg-gray-100 gap-6 md:gap-4">
  {/* Do Lessons Button */}
  <Link href="/quiz">
    <div className="group relative flex flex-col items-center justify-center p-2 md:p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-lg cursor-pointer w-16 h-16 md:w-48 md:h-24 transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <FaBook className="text-white text-3xl md:text-3xl group-hover:text-blue-100 transition-all" />
      <span className="font-bold text-center text-lg text-white hidden md:block">
        Do Lessons
      </span>
    </div>
  </Link>

  {/* Play Game Button */}
  <Link href="/game">
    <div className="group relative flex flex-col items-center justify-center p-2 md:p-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl shadow-lg cursor-pointer w-16 h-16 md:w-48 md:h-24 transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <FaGamepad className="text-white text-3xl md:text-3xl group-hover:text-green-100 transition-all" />
      <span className="font-bold text-center text-lg text-white hidden md:block">
        Play Game
      </span>
    </div>
  </Link>
</div>

        <motion.form
          onSubmit={handleSubmit}
          className="mb-12"
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex gap-2 shadow-lg rounded-full overflow-hidden">
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Search any word..."
              className="flex-1 p-4 text-lg border-0 focus:ring-2 focus:ring-purple-500 focus:outline-none rounded-l-full"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 text-lg font-medium rounded-r-full transition-all duration-300 disabled:opacity-70"
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
      </motion.div>
    </div>
  );
}
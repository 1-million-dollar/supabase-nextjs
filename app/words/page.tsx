'use client'

import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { fetchUserWords } from "../lib/data";
import { Suspense, useState, useEffect } from "react";
import LoadingScreen from "../ui/loadingscreen";
import CreatedDate from "../ui/createddate";

interface DictionaryEntry {
  word: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
    }[];
  }[];
}

export default function Page() {
    const supabase = createClient();
    const { data: session } = useSession();
    const email = session?.user?.email;
    const [words, setWords] = useState<string[]>([]);
    const [expandedWord, setExpandedWord] = useState<string | null>(null);
    const [wordDetails, setWordDetails] = useState<DictionaryEntry | null>(null);
    const [loadingWord, setLoadingWord] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (email) {
                const userWords = await fetchUserWords(email);
                setWords(userWords || []);
                console.log(userWords);
            }
        };
        fetchData();
    }, [email]);

    const fetchWordDetails = async (word: string) => {
        setLoadingWord(true);
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setWordDetails(data[0]);
                setExpandedWord(word);
            }
        } catch (error) {
            console.error("Failed to fetch word details:", error);
        } finally {
            setLoadingWord(false);
        }
    };

    const toggleWord = (word: string) => {
        if (expandedWord === word) {
            setExpandedWord(null);
            setWordDetails(null);
        } else {
            fetchWordDetails(word);
        }
    };

    if (!session || !session?.user) {
        redirect('/');
    }

    return (
        <div className="h-full bg-gradient-to-b from-green-50 to-green-100 p-4">
            <Suspense fallback={<LoadingScreen />}>
                <div className="max-w-4xl mx-auto">
                    <div className='p-5'>
                        <Link href="/quiz/review">
                            <div className="flex justify-center items-center w-full h-12 mb-5 bg-gradient-to-r from-green-400 to-teal-400 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                                Start quiz to revise your words...
                            </div>
                        </Link>
                    </div>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-24 md:mb-0'>
                        {words.map((word, i) => (
                            <div 
                                key={i} 
                                className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${expandedWord === word ? 'ring-2 ring-green-500' : 'hover:shadow-lg'}`}
                            >
                                <div 
                                    className="p-5 cursor-pointer"
                                    onClick={() => toggleWord(word)}
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className='text-xl font-bold text-green-800'>{word}</h3>
                                        <span className="text-gray-500 text-sm">
                                            <CreatedDate word={word} />
                                        </span>
                                    </div>
                                </div>
                                
                                {expandedWord === word && (
                                    <div className="px-5 pb-5 pt-0 border-t border-gray-100">
                                        {loadingWord ? (
                                            <div className="text-center py-4">
                                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                                            </div>
                                        ) : wordDetails ? (
                                            <div className="space-y-4">
                                                {wordDetails.meanings.map((meaning, index) => (
                                                    <div key={index} className="mt-3">
                                                        <p className="text-sm font-semibold text-green-600">{meaning.partOfSpeech}</p>
                                                        <ul className="list-disc pl-5 mt-1 space-y-1">
                                                            {meaning.definitions.slice(0, 2).map((def, defIndex) => (
                                                                <li key={defIndex} className="text-gray-700">
                                                                    {def.definition}
                                                                    {def.example && (
                                                                        <p className="text-gray-500 italic mt-1">Example: "{def.example}"</p>
                                                                    )}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                                <Link 
                                                    href={`/dictionary/${word}`} 
                                                    className="inline-block mt-4 text-green-600 hover:text-green-800 font-medium text-sm"
                                                >
                                                    View full details →
                                                </Link>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">No definition found</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </Suspense>
        </div>
    );
}
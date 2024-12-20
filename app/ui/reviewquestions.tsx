'use client'

import { fetchUserWords, UpdateFrequency } from '@/app/lib/data'
import { fetchReviewQuestions } from '@/app/lib/data'
import { type User } from '@supabase/supabase-js'

import { useState, useEffect } from 'react'

import LoadingScreen from './loadingscreen'

type QuestionType = {
    word: string;
    answer: string;
    option_1: string;
    option_2: string;
    option_3: string;
    option_4: string;
  };


export default function ReviewQuestions({user} : {user: User | null}) {

    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [result, setResult] = useState("");
    const [selectedOption, setSelectedOption] = useState<string | null>("");
    const [correctOption, setCorrectOption] = useState<string | null>("");
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                if(user?.id) {
                    console.log('Fetching data...');
                    const words = await fetchUserWords(user?.id)
                    setQuestions(await fetchReviewQuestions(words))
                }
            } catch (error) {
              console.error('Error fetching data:', error);
            } finally {
                setLoading(false)
            }
          };
      
          fetchData();
    }, [])

    const data = questions[currentQuestion]
          
    const word = data?.word
    const correctAnswer = data?.answer

    const options = [data?.option_1, data?.option_2, data?.option_3, data?.option_4]

    const handleAnswerClick = (option: string) => {
        setSelectedOption(option);
        setCorrectOption(correctAnswer)
        setResult(option === correctAnswer ? "correct" : "incorrect");
      };

      const handleNextQuestion = () => {
        if (selectedOption === questions[currentQuestion].answer) {
            if (user)
            UpdateFrequency(user?.id, word)
          
        }

        setSelectedOption("");
        setResult("")
        


        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setIsQuizCompleted(true);
        }
    };

    if (loading) {
        return (
            <div>
                <LoadingScreen />
            </div>
            
        )
    }

    return (
        <div className="flex flex-col p-5 bg-white text-black rounded-lg shadow-[0px_87px_78px_-39px_rgba(0,0,0,0.4)] w-full">
           
            {!isQuizCompleted ? (
                <>
                
                <div className="flex items-center justify-between">
                    <p className="text-[rgb(49,49,49)] text-base font-extrabold leading-4">What is the meaning of {word} ?</p>
                </div>
                <div>
                    {options.map((option, index) => (
                        
                        <button
                            key={index}
                            onClick={() => handleAnswerClick(option)}
                            className={`flex w-full text-start bg-white p-5 mt-5 rounded-lg cursor-pointer text-sm font-semibold border transition-all duration-300 
                                        ${selectedOption === option ?(option === correctAnswer ? "border-green-500 text-green-500" : "border-red-500 text-red-500") : "border-gray-300 hover:bg-gray-100"}
                                        ${correctOption === option ? "border-green-500 text-green-500" : "border-gray-300 hover:bg-gray-100"}
                                    `}
                            disabled={selectedOption !== ""}>
                            {option}
                        </button>
                    ))}
                </div>
                    
                <div className="flex p-5 items-center justify-end">
                    
                    <button
                        onClick={handleNextQuestion}
                        className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                    Next
                    </button>
                </div>

                {result && (
                    <div className={`result mt-3 p-5 font-semibold text-sm ${result === "correct" ? "text-green-500" : "text-red-500"}`}>
                        Your answer is {result}!
                    </div>
                )}</>
            ) : (
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-green-500 mb-4">Congratulations!</h2>
                    
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-green-600 text-white text-lg rounded"
                        >
                            Revise more words..
                        </button>
                    
                </div>
            
            )}
        </div>
    )
}
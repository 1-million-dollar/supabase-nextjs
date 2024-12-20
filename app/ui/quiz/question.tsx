"use client";

import Confetti from "./confetti";
import { type User } from '@supabase/supabase-js'

import { UpdateScore } from "@/app/lib/data";


import { useState, useEffect } from "react";



type QuestionType = {
    word: string;
    answer: string;
    option_1: string;
    option_2: string;
    option_3: string;
    option_4: string;
  };


export default function Question({questions, user} : {questions: QuestionType[], user: User | null}) {

    
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20);
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [result, setResult] = useState("");
    const [selectedOption, setSelectedOption] = useState<string | null>("");
    const [correct, setCorrect] = useState(0)
    const [wrong, setWrong] = useState(0)
    const [notupdated, setNotUpdated] = useState(true)
    
    const [correctOption, setCorrectOption] = useState<string | null>("");
    

    

    const data = questions[currentQuestion]
          
    const word = data?.word
    const correctAnswer = data?.answer

    const options = [data?.option_1, data?.option_2, data?.option_3, data?.option_4]
    
    
    useEffect(() => {
        if (timeLeft > 0) {
          const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
          return () => clearTimeout(timer);
        } else {
          handleNextQuestion();
        }
      }, [timeLeft]);

      
      const handleAnswerClick = (option: string) => {
        setSelectedOption(option);
        setCorrectOption(correctAnswer)
        setResult(option === correctAnswer ? "correct" : "incorrect");
      };

      const handleNextQuestion = () => {
        if (selectedOption === questions[currentQuestion].answer) {
          setScore(score + 10);
          setCorrect(correct + 1)
        }
        else if(selectedOption !== questions[currentQuestion].answer && selectedOption !== "") {
          setWrong(wrong + 1)
        }

        setSelectedOption("");
        setResult("")
        setTimeLeft(20);


        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
          
            setIsQuizCompleted(true)
            
           
        }
    };
  

    if (isQuizCompleted && notupdated) {
      if(user)
      UpdateScore(user?.id, score, correct, wrong)
      setNotUpdated(false)
    }
       
    



    return (
        <div className="flex flex-col p-5 bg-white text-black rounded-lg shadow-[0px_87px_78px_-39px_rgba(0,0,0,0.4)] w-full">
            <style jsx global>{`
  @keyframes fly-out {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(calc(100vw * var(--x)), calc(100vh * var(--y))) scale(0.5);
    opacity: 0;
  }
}

@keyframes move-out {
  0% {
    transform: translate(-50%, -50%) translate(0, 0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) translate(var(--x), var(--y));
    opacity: 0;
  }
}
  @keyframes instant-move {
  0% {
    transform: translate(-50%, -50%) translate(0, 0);
  }
  100% {
    transform: translate(-50%, -50%) translate(var(--x), var(--y));
  }
}

@keyframes random-move {
  0% {
    transform: translate(-50%, -50%) translate(0, 0);
  }
  100% {
    transform: translate(-50%, -50%) translate(var(--x), var(--y));
  }
}

@keyframes fade-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
`}</style>

            {!isQuizCompleted ? (
                <>
                <div className="p-1 mb-10">
                    <div
                        className="bg-blue-500 h-2 rounded-full transition-width duration-1000 ease-linear"
                        style={{ width: `${(timeLeft/20)*100}%` }}
                     ></div>
                </div>
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
                    <p className="text-xl">{score} Points earned</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                    >
                      Restart Rapid Quiz
                    </button>
                    
                    <Confetti />

                    
                </div>
            
            )}
            
        </div>
    )
}
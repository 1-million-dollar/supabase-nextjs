"use client";

import Confetti from "react-confetti";
import { type User } from '@supabase/supabase-js';
import { UpdateScore } from "@/app/lib/data";
import { useState, useEffect } from "react";
import { FaTrophy, FaRedo, FaClock, FaCheckCircle, FaTimesCircle, FaBrain } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react"
import { redirect } from "next/navigation";

type QuestionType = {
  word: string;
  answer: string;
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
};

export default function Question({ questions, user }: { questions: QuestionType[], user: User | null }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [notupdated, setNotUpdated] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const { data : session } = useSession()

  if (!session || !session.user) {
    redirect('/')
  }
  const email = session?.user?.email
  const data = questions[currentQuestion]
  const word = data?.answer;
  const correctAnswer = data?.word;
  const options = [data?.option_1, data?.option_2, data?.option_3, data?.option_4];

  useEffect(() => {
    if (timeLeft > 0 && !selectedOption) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !selectedOption) {
      handleNextQuestion();
    }
  }, [timeLeft, selectedOption]);

  const handleAnswerClick = (option: string) => {
    setSelectedOption(option);
    const correct = option === correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(prev => prev + 10);
      setCorrect(prev => prev + 1);
    } else {
      setWrong(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    setTimeLeft(10);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsQuizCompleted(true);
    }
  };

  if (isQuizCompleted && notupdated) {
    if (email) UpdateScore(email, score, correct, wrong);
    setNotUpdated(false);
  }

  const progressPercentage = (currentQuestion / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-yellow-50 rounded-2xl shadow-xl border border-yellow-200">
      {!isQuizCompleted ? (
        <>
          {/* Header with progress and timer */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-yellow-800">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full border border-yellow-300">
                <FaClock className="text-yellow-700" />
                <span className="font-medium text-yellow-800">{timeLeft}s</span>
              </div>
            </div>
            
            <div className="w-full bg-yellow-200 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-green-500 to-yellow-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <p className="text-xl text-yellow-800 font-semibold">{word}</p>
          </div>

          {/* Options */}
          <div className="grid gap-3 mb-6">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => !selectedOption && handleAnswerClick(option)}
                className={`
                  p-4 rounded-xl text-left font-medium transition-all duration-200
                  ${!selectedOption 
                    ? "bg-white hover:bg-yellow-100 border-2 border-yellow-300 hover:border-green-500 hover:shadow-lg text-yellow-800" 
                    : option === correctAnswer 
                      ? "bg-green-100 border-2 border-green-500 text-green-700"
                      : selectedOption === option 
                        ? "bg-red-100 border-2 border-red-500 text-red-700"
                        : "bg-white border-2 border-yellow-300 text-yellow-800"}
                `}
                disabled={selectedOption !== null}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Feedback and next button */}
          {showFeedback && (
            <div className={`flex items-center justify-between p-4 mb-6 rounded-lg ${isCorrect ? 'bg-green-100 border border-green-500' : 'bg-red-100 border border-red-500'}`}>
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <FaCheckCircle className="text-green-600 text-xl" />
                    <span className="text-green-800 font-medium">Correct!</span>
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="text-red-600 text-xl" />
                    <span className="text-red-800 font-medium">Incorrect! The answer was {correctAnswer}</span>
                  </>
                )}
              </div>
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2 bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white font-bold rounded-lg transition-all shadow-lg"
              >
                {currentQuestion + 1 === questions.length ? "See Results" : "Next"}
              </button>
            </div>
          )}

          {/* Time progress bar (bottom) */}
          <div className="w-full bg-yellow-200 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-green-500 to-yellow-500 h-1.5 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / 10) * 100}%` }}
            ></div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 relative overflow-hidden">
          <Confetti 
            recycle={false} 
            numberOfPieces={500} 
            colors={['#22c55e', '#facc15', '#ef4444']}
          />
          
          <div className="bg-gradient-to-r from-green-500 via-yellow-400 to-yellow-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTrophy className="text-white text-4xl" />
          </div>
          
          <h2 className="text-3xl font-bold text-yellow-800 mb-2">Quiz Completed!</h2>
          <p className="text-xl text-yellow-700 mb-6">You scored <span className="font-bold text-green-600">{score}</span> points</p>
          
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-8">
            <div className="bg-green-100 p-4 rounded-lg border border-green-500">
              <p className="text-green-600 font-bold text-2xl">{correct}</p>
              <p className="text-green-800">Correct</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg border border-red-500">
              <p className="text-red-600 font-bold text-2xl">{wrong}</p>
              <p className="text-red-800">Wrong</p>
            </div>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white font-bold rounded-lg transition-all shadow-xl hover:shadow-2xl flex items-center gap-2 mx-auto"
          >
            <FaRedo /> Play Again
          </button>
          
          <div className="mt-6 text-yellow-700 flex items-center justify-center gap-1">
            <FaBrain />
            <span className="text-sm">Knowledge Challenge</span>
          </div>
        </div>
      )}
    </div>
  );
}
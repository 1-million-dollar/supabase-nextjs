"use client"; // Mark this as a Client Component

import { useState, useRef, useEffect } from "react";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { redirect } from "next/navigation";

import { UpdateLevel } from "@/app/lib/data";

import { useSession } from "next-auth/react"


type QuestionType = {
    question: string;
    options: string[];
    correctAnswer: string;
  }

export default function QuestionPage({questions, level} : {questions: QuestionType[], level: number}) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [userAnswers, setUserAnswers] = useState<{ question: string; userAnswer: string; correctAnswer: string }[]>([]);
    const [showConfetti, setShowConfetti] = useState(false);

    const { data:session } = useSession()

    const email = session?.user?.email
  
    // Audio refs
    const questionAudioRef = useRef<HTMLAudioElement>(null);
    const answerClickAudioRef = useRef<HTMLAudioElement>(null);
    const winAudioRef = useRef<HTMLAudioElement>(null);
    const loseAudioRef = useRef<HTMLAudioElement>(null);
  
    // Play question music when the question changes
    useEffect(() => {
      if (questionAudioRef.current) {
        questionAudioRef.current.play();
      }
    }, [currentQuestion]);
  
    const handleAnswerClick = (option: string) => {
      setSelectedAnswer(option);
      // Play answer click sound
      if (answerClickAudioRef.current) {
        answerClickAudioRef.current.play();
      }
    };
  
    const handleNextQuestion = () => {
      // Save the user's answer and the correct answer
      setUserAnswers([
        ...userAnswers,
        {
          question: questions[currentQuestion].question,
          userAnswer: selectedAnswer!,
          correctAnswer: questions[currentQuestion].correctAnswer,
        },
      ]);
  
      // Update the score if the answer is correct
      if (selectedAnswer === questions[currentQuestion].correctAnswer) {
        setScore(score + 1);
      }
  
      // Move to the next question or finish the quiz
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowScore(true);
        // Show confetti and play win/lose music based on the score
        if (score + 1 === questions.length) {
          setShowConfetti(true);
          if (winAudioRef.current) {
            winAudioRef.current.play();
          }
        } else {
          if (loseAudioRef.current) {
            loseAudioRef.current.play();
          }
        }
      }
    };
  
    const restartQuiz = () => {

        if (score === questions.length && email) {
            UpdateLevel(level, email).then(() => {
              redirect(`/quiz/lessons/`)
            })
            
          }
       

      setCurrentQuestion(0);
      setScore(0);
      setShowScore(false);
      setSelectedAnswer(null);
      setUserAnswers([]);
      setShowConfetti(false);
      // Stop all audio and reset
      if (questionAudioRef.current) questionAudioRef.current.pause();
      if (answerClickAudioRef.current) answerClickAudioRef.current.pause();
      if (winAudioRef.current) winAudioRef.current.pause();
      if (loseAudioRef.current) loseAudioRef.current.pause();

      

      
    };
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        {/* Audio elements */}
        <audio ref={questionAudioRef} src="/sounds/question.mp3" />
        <audio ref={answerClickAudioRef} src="/sounds/answer-click.mp3" />
        <audio ref={winAudioRef} src="/sounds/win.mp3" />
        <audio ref={loseAudioRef} src="/sounds/lose.mp3" />
  
        {showConfetti && <Confetti />}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md text-center">
            <p className="font-extrabold text-2xl p-5">Level - {level}</p>
          {showScore ? (
            <AnimatePresence>
              <motion.div
                key="score"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                {score === questions.length ? (
                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-green-600">Level Passed! 🎉</h2>
                    <p className="text-lg mb-4">You scored {score} out of {questions.length}!</p>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-red-600">Retry Level! 😢</h2>
                    <p className="text-lg mb-4">You scored {score} out of {questions.length}.</p>
                  </div>
                )}
                <motion.button
                  onClick={restartQuiz}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full md:w-auto"
                >
                  {score === questions.length ? "Next Level": "Retry Level"}
                </motion.button>

                <div className="mt-6 space-y-4 text-left">
                  {userAnswers.map((answer, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2, duration: 0.5 }}
                      className="p-4 border rounded-lg"
                    >
                      <p className="font-semibold">{answer.question}</p>
                      <p className={`mt-2 ${answer.userAnswer === answer.correctAnswer ? "text-green-600" : "text-red-600"}`}>
                        Your answer: {answer.userAnswer}
                      </p>
                      {answer.userAnswer !== answer.correctAnswer && (
                        <p className="text-gray-600">Correct answer: {answer.correctAnswer}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
                
              </motion.div>
            </AnimatePresence>
          ) : (
            <AnimatePresence>
              <motion.div
                key="question"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-semibold mb-4">
                  Question {currentQuestion + 1}
                </h2>
                
                <p className="mb-6 text-lg">Choose the word that has the meaning <b>{questions[currentQuestion].question}</b> ?</p>
                
                
                <div className="space-y-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerClick(option)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full px-4 py-2 rounded ${
                        selectedAnswer === option
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
                <motion.button
                  onClick={handleNextQuestion}
                  disabled={!selectedAnswer}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed w-full md:w-auto"
                >
                  {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
                </motion.button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    );
}
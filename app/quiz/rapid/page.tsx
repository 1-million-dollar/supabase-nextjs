'use client'


import Question from "@/app/ui/quiz/question"
import { useEffect, useState } from "react"
import LoadingScreen from "@/app/ui/loadingscreen"

import { fetchRapidQuestions } from "@/app/lib/data"

type QuestionType = {
    word: string;
    answer: string;
    option_1: string;
    option_2: string;
    option_3: string;
    option_4: string;
  };



export default function Page() {

    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching data...');
                const questions = await fetchRapidQuestions()
                
                setQuestions(questions)

                // fetching user
               

                
                
               
                
            } catch (error) {
              console.error('Error fetching data:', error);
            }
            finally {
                setLoading(false)
            }
          }
          fetchData();
    }, [])

    if (loading) {
        return (
            <div><LoadingScreen /></div>
        )
    }
    return(
        <div>
           
                <Question questions={questions} />    
           
        </div>
    )
}
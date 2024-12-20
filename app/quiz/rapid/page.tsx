'use client'

import { type User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'

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
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching data...');
                const questions = await fetchRapidQuestions()
                
                setQuestions(questions)

                // fetching user
                const supabase = await createClient()

                const {
                    data: { user },
                    } = await supabase.auth.getUser()
                
                setUser(user)
                
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
           
                <Question questions={questions} user={user} />    
           
        </div>
    )
}
'use client'

import { useState, useEffect } from "react"
import ProfilePhoto from "./profilephoto"
import { getLearners } from "../lib/data"
import Link from "next/link"

type LearnerType = {
    id: string;
    full_name: string;
    avatar_url: string;
    points: number;
    correct: number;
    wrong: number;
  };


export default function Leaderboard() {
    
    const [learners, setLearners] = useState<LearnerType[]>([]);
    const [loading, setLoading] = useState(true)
 
    
    
   
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const learners = await getLearners()
                if (learners) {
                    setLearners(learners)
                }
                    
                
            } catch(error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        } 
        fetchData()
       
    }, [])

    
   
    
    
   
    return (

        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
            <table className="table-auto w-full border-collapse bg-white shadow-md rounded-lg">
                <thead>
                    
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2 text-left text-gray-700 font-medium"></th>
                        <th className="px-4 py-2 text-left text-gray-700 font-medium">Learners</th>
                        <th className="px-4 py-2 text-gray-700 font-medium">Points</th>
                        <th className="px-4 py-2 text-gray-700 font-medium">Accuracy</th>
                    </tr>
                </thead>
                <tbody>
                   {!loading ? (
                    learners.map((learner, index) => (
                        
                        <tr key={index} className="hover:bg-gray-100">
                            
                            <th className="px-2 py-2">
                            <Link key={index} href={`/c/${learner.id}`}>
                                <ProfilePhoto url={learner.avatar_url} size={35} />
                            </Link>
                            </th>
                            <th className="text-left px-4 py-2">
                                <Link key={index} href={`/c/${learner.id}`}>
                                    {learner.full_name}
                                </Link>
                            </th>
                            <th className="px-4 py-2">{learner.points}</th>
                            <th className="px-4 py-2">{Math.round((learner.correct / (learner.wrong + learner.correct))*100)}%</th>
                            
                        </tr>
                       
                    ))
                   ) :<tr>
                   <td className="text-center py-4">
                     Loading...
                   </td>
                 </tr>}
                </tbody>
            </table>
        </div>
    )
}
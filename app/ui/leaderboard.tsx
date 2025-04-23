'use client'

import { useState, useEffect } from "react"

import { getLearners } from "../lib/data"
import Link from "next/link"

type LearnerType = {
    id: string;
    name: string;
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

        <div className="max-w-4xl mx-auto mb-24 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-indigo-800 text-center">Leaderboard</h1>
<div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mx-2 md:mx-0">
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
                <tr>
                    <th className="px-3 py-3 md:px-6 md:py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Rank</th>
                    <th className="px-3 py-3 md:px-6 md:py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Learners</th>
                    <th className="px-3 py-3 md:px-6 md:py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">Points</th>
                    <th className="px-3 py-3 md:px-6 md:py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">Accuracy</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {!loading ? (
                    learners.map((learner, index) => (
                        <tr 
                            key={index} 
                            className={`transition-all duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50`}
                        >
                            <td className="px-3 py-4 md:px-6 whitespace-nowrap">
                                <div className="flex items-center">
                                    <span className={`flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full 
                                        ${index === 0 ? 'bg-yellow-400 text-yellow-900' : 
                                          index === 1 ? 'bg-gray-300 text-gray-800' : 
                                          index === 2 ? 'bg-amber-600 text-amber-100' : 
                                          'bg-gray-100 text-gray-600'} font-bold text-xs md:text-sm`}>
                                        {index + 1}
                                    </span>
                                </div>
                            </td>
                            <td className="px-3 py-4 md:px-6 whitespace-nowrap">
                                <Link href={`/c/${learner.id}`} className="group flex items-center space-x-2 md:space-x-3">
                                    <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <span className="text-indigo-700 font-medium text-sm md:text-base">
                                            {learner.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs md:text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors truncate max-w-[100px] md:max-w-none">
                                            {learner.name}
                                        </p>
                                    </div>
                                </Link>
                            </td>
                            <td className="px-3 py-4 md:px-6 whitespace-nowrap text-center">
                                <span className="px-2 py-0.5 md:px-3 md:py-1 inline-flex text-xs md:text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {learner.points} pts
                                </span>
                            </td>
                            <td className="px-3 py-4 md:px-6 whitespace-nowrap text-center">
                                <div className="flex flex-col items-center">
                                    <span className={`text-xs md:text-sm font-semibold ${
                                        (learner.correct / (learner.wrong + learner.correct) * 100) > 75 ? 'text-green-600' : 
                                        (learner.correct / (learner.wrong + learner.correct) * 100) > 50 ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                        {Math.round((learner.correct / (learner.wrong + learner.correct))*100)}%
                                    </span>
                                    <div className="w-full bg-gray-200 rounded-full h-1 md:h-1.5 mt-1">
                                        <div 
                                            className={`h-1 md:h-1.5 rounded-full ${
                                                (learner.correct / (learner.wrong + learner.correct) * 100) > 75 ? 'bg-green-500' : 
                                                (learner.correct / (learner.wrong + learner.correct) * 100) > 50 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`} 
                                            style={{width: `${Math.round((learner.correct / (learner.wrong + learner.correct)) * 100)}%`}}
                                        ></div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td className="px-6 py-8 text-center">
                            <div className="flex justify-center items-center space-x-2">
                                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-indigo-600 animate-bounce"></div>
                                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-indigo-600 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-indigo-600 animate-bounce" style={{animationDelay: '0.4s'}}></div>
                            </div>
                            <p className="mt-3 text-sm md:text-base text-gray-600">Loading leaderboard data...</p>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
</div>
        </div>
    )
}
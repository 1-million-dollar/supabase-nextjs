import Link from 'next/link';

export default function HomeCards() {
    return (
        <div className='flex flex-col gap-4 p-4'>
            {/* Big Lessons Card - Top */}
            <Link href='/quiz/lessons'>
                <div className="bg-gradient-to-r from-[#6E45E2] to-[#89D4CF] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-white w-full h-32 flex items-center">
                    <div className="flex items-center gap-5 w-full">
                        <div className="bg-white/20 p-4 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold">Lessons</h3>
                            <p className="text-base opacity-90 mt-1">Resume your learning journey</p>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Revise and Play Cards in a Row */}
            <div className="flex gap-4 w-full">
                {/* Revise Words Card */}
                <Link href='/quiz/review' className="flex-1">
                    <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 text-white h-full">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-9h6" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Revise</h3>
                                <p className="text-sm opacity-90 mt-1">Strengthen your word knowledge</p>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Play Card */}
                <Link href='/game' className="flex-1">
                    <div className="bg-gradient-to-r from-[#FF9A8B] to-[#FF6B95] rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 text-white h-full">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Play</h3>
                                <p className="text-sm opacity-90 mt-1">Learn through play</p>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Big Quiz Card - Bottom */}
            <Link href='/quiz/rapid'>
                <div className="bg-gradient-to-r from-[#4ECDC4] to-[#2B8BBA] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-white w-full h-32 flex items-center">
                    <div className="flex items-center gap-5 w-full">
                        <div className="bg-white/20 p-4 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold">Quiz</h3>
                            <p className="text-base opacity-90 mt-1">Test your language skills</p>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}
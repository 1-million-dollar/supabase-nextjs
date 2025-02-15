import Link from "next/link"

export default function Page() {
    return (
        <div className="fkex flex-col p-5">
            <Link href="/quiz/rapid">
                <div className="flex justify-center items-center w-full h-10 mb-5 bg-green-400 text-black font-bold rounded-lg shadow-lg">Start a rapid quiz</div>
            </Link>
            <Link href="/quiz/lessons">
                <div className="flex justify-center items-center w-full h-10 mb-5 bg-green-400 text-black font-bold rounded-lg shadow-lg">Vocab Lessons</div>
            </Link>
        </div>
        
    )
}
'use client'
import Link from "next/link"

export default function Page() {
    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <p className="font-bold">Invalid Credentianls</p>
            <div>
            <Link href={`/login`}>
                <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-3xl font-medium text-white backdrop-blur-3xl">
                        Login
                    </span>
                </button>
            </Link>

            <Link href={`/signup`}>
                <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-3xl font-medium text-white backdrop-blur-3xl">
                        Sign up
                    </span>
                </button>
            </Link>
            </div>
        </div>
    )
}
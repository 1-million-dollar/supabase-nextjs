"use client";

import Link from "next/link"

import { useState } from "react"

export default function SearchBox() {
    const [ word, setWord ] = useState('')
    return (
        <form>
            <div className='flex flex-row items-center space-x-2'>
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className='flex rounded-2xl border-2 border-black p-4 md:w-[400px]'
          placeholder="Enter a word"
        />
        <Link href={`/dictionary/${word}`}>
            <button type="submit" className='flex rounded-2xl p-4 border-2 border-green-800 bg-green-400'>Search</button>
        </Link>
       
      </div>
        </form>
    )
}
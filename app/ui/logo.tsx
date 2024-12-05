"use client"

import { BookOpenIcon } from '@heroicons/react/24/solid' 
import Link from "next/link"



export default function Logo() {

    

    return(
        <div className=''>
            <Link className='flex flex-row w-32 bg-green-400 rounded-lg items-center leading-none' href="/home">
               <BookOpenIcon className='h-12 w-12 rounded-full' />
               <p className='font-extrabold'>WordHub</p>
            </Link>

        </div>
    )
}
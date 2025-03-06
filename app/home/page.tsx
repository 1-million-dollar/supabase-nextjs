
import { createClient } from '@/utils/supabase/server'

import SearchBox from '../ui/searchbox'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import LoadingScreen from '../ui/loadingscreen'
import Leaderboard from '../ui/leaderboard'
import SearchRibbon from '../ui/searchribbon'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { FaBook, FaGamepad } from "react-icons/fa"; // Import icons
import { motion } from "framer-motion"; // For animations


export const metadata: Metadata = {
  title: 'Home',
};

export default async function Page() {

    const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Redirect to the login page if not logged in
    redirect("/")
  }
  else if(user) {
    const { error } = await supabase
      .from('profiles')
      .update([{ last_sign_in: new Date() }])
      .eq('id', user?.id)

    if (error) {
      console.log(error)
    }
  }

  

    return (
      
        <div className='flex md:flex-row flex-col mb-24 md:mb-0 p-2'>
          <Suspense fallback={<LoadingScreen />}>
          <div className='md:w-3/4'>
          <div className='flex justify-center p-5'>
            <SearchBox />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-evenly p-4 h-min bg-gray-100">
            {/* Do Lessons Button */}
            <Link href="/quiz">
              <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg cursor-pointer m-2 w-48 h-24">
                <FaBook className="text-white text-3xl mb-2" /> {/* Icon */}
                <span className="font-extrabold text-center text-lg text-white">
                  Do Lessons
                </span>
              </div>
            </Link>

            {/* Play Game Button */}
            <Link href="/game">
              <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg cursor-pointer m-2 w-48 h-24">
                <FaGamepad className="text-white text-3xl mb-2" /> {/* Icon */}
                <span className="font-extrabold text-center text-lg text-white">
                  Play Game
                </span>
              </div>
            </Link>
          </div>
         
          
        </div>
        <div className='p-1'>
         <div className='flex-row justify-center mb-10 border-2 rounded-full border-black items-center p-2 hidden md:block'>
          Search...
         </div>
         <p className='p-2 text-start font-bold'>Read Articles</p>
         <Link href='https://www.thehindu.com/' target="_blank">
          <div className='p-10 border-2 border-black rounded-lg mb-5'>
            <Image src='https://www.thehindu.com/theme/images/th-online/thehindu-logo.svg' alt='the hindu' width={250} height={250} />
          </div>
         </Link>
         <Link href='https://indianexpress.com/' target="_blank">
          <div className='p-10 border-2 border-black rounded-lg mb-5'>
            <Image src='https://indianexpress.com/wp-content/themes/indianexpress/images/indian-express-logo-n.svg' alt='the indian express' width={250} height={250} />
          </div>
         </Link>
         <Link href='https://aeon.co/' target="_blank">
         <div className='flex flex-row justify-center border-2 rounded-lg border-black text-4xl p-10 mb-5'>
          <i className='text-red-500'>aeon </i> Essays
         </div>
         </Link>
         <Link href='https://ia601307.us.archive.org/15/items/storyofmylif00sims/storyofmylif00sims.pdf' target="_blank">
          <div className='flex flex-row items-center justify-center border-2 border-black rounded-lg mb-5'>
            <Image src='/the_story_of_my_life.jpg' alt='the story of my life' width={250} height={250} />
          </div>
         </Link>
         <Link href='https://people.maths.ox.ac.uk/moulton/documents/The_Adventures_of_Sherlock_Holmes.pdf' target="_blank">
          <div className='flex flex-row items-center justify-center border-2 border-black rounded-lg mb-5'>
            <Image src='/advent_of_sh.jpg' alt='the adventures of sherlock holmes' width={250} height={250} className='rounded-md w-full h-full' />
          </div>
         </Link>
         <Link href='https://www.funeralhelp.co.uk/files/The%20Art%20Of%20Public%20Speaking.pdf' target="_blank">
          <div className='flex flex-row items-center justify-center border-2 border-black rounded-lg mb-5'>
            <Image src='/dale_car.jpg' alt='the art of public speaking' width={250} height={250} className='rounded-md w-full h-full' />
          </div>
         </Link>
        </div>
          </Suspense>
          <div className='mb-24'>
            <Leaderboard />
          </div>
        </div>
        
    )
}
import { fetchUserWords } from '../lib/data'

import { createClient } from '@/utils/supabase/server'
import Profile from '../ui/profile'
import Link from 'next/link'
import { Suspense } from 'react'
import LoadingScreen from '../ui/loadingscreen'
import { redirect } from 'next/navigation'
import CreatedDate from '../ui/createddate'


export default async function Page() {
    
    let words 

    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    if (user?.id) {
        words = await fetchUserWords(user?.id)
    }
    
    return (
        <div><Suspense fallback={<LoadingScreen />}>
            <div>
            <div className='p-2'>
                <Profile user={user} />
            </div>
            
          <div className='flex flex-col mb-24 md:mb-0 p-2'>
            {words?.map((word, i) => (
                <Link key={i} href={`/dictionary/${word}`} className='flex w-max'>
                    <div key={i} className='h-full w-max bg-green-200 p-5 mb-2 rounded-2xl'>
                        <p className='text-lg font-bold'>{word}</p>
                        
                        <CreatedDate word = {word} />
                        
                    </div>
                </Link>
                
            ))}
          </div>
          </div>
          </Suspense>
        </div>
        
    )
}


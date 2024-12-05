import { fetchUserWords } from '../lib/data'

import { createClient } from '@/utils/supabase/server'
import Profile from '../ui/profile'
import Link from 'next/link'


export default async function Page() {
    
    let words

    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()


    if (user?.id) {
        words = await fetchUserWords(user?.id)
    }
    
    
    
    
    return (
        <div>
            <div>
                <Profile user={user} />
            </div>
            
          <div>
            {words?.map((word, i) => (
                <Link key={i} href={`/dictionary/${word}`}>
                    <div key={i} className='h-full w-max bg-green-200 p-5 mb-2 rounded-2xl'>
                        {word}
                    </div>
                </Link>
                
            ))}
          </div>
        </div>
        
    )
}
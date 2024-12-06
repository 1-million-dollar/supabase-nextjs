
import { createClient } from '@/utils/supabase/server'
import Poster from '../ui/poster'
import SearchBox from '../ui/searchbox'
import { redirect } from 'next/navigation'


export default async function Page() {

    const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Redirect to the login page if not logged in
    redirect("/login")
    return null;
  }

    return (
        <div className='flex flex-col justify-center w-full'>
           <div className='flex justify-center p-5'>
            <Poster />
           </div>
           
           <div className='flex justify-center p-5'>
            <SearchBox />
           </div>
        </div>
    )
}
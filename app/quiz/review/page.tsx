import { createClient } from '@/utils/supabase/server'

import ReviewQuestions from '@/app/ui/reviewquestions'
import { redirect } from 'next/navigation'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Review Your Words',
  };


export default async function Page() {

    
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }
    
    return (
        <div>
            <ReviewQuestions user={user} />
        </div>
    )
}
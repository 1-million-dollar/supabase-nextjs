import { createClient } from '@/utils/supabase/server'

import ReviewQuestions from '@/app/ui/reviewquestions'
import { redirect } from 'next/navigation'




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
import { createClient } from '@/utils/supabase/server'

import ReviewQuestions from '@/app/ui/reviewquestions'




export default async function Page() {

    
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    
    return (
        <div>
            <ReviewQuestions user={user} />
        </div>
    )
}
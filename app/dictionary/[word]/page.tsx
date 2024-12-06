

import WordMeaning from '@/app/ui/wordmeaning';
import { createClient } from "@/utils/supabase/server";

  

export default async function Page({params} : {params : {word : string}}) {
   
    const word = await (params.word)

    const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user)

  return(
    <div>
        <WordMeaning word={word}
            user={user} />
    </div>
  )
}
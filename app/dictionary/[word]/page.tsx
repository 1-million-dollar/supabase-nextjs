

import WordMeaning from '@/app/ui/wordmeaning';
import { createClient } from "@/utils/supabase/server";

type Params = Promise<{ word: string }>


export default async function Page(props: { params: Params }) {
   
  const params = await props.params;
  const word = params.word;

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
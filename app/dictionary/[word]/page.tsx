

import WordMeaning from '@/app/ui/wordmeaning';
import LoadingScreen from '@/app/ui/loadingscreen';
import { createClient } from "@/utils/supabase/server";

import React, { Suspense } from 'react';

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
      <Suspense fallback={<div><LoadingScreen /></div>}>
        <WordMeaning word={word}
            user={user} />
      </Suspense>
    </div>
  )
}
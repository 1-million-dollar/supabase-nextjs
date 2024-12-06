

import WordMeaning from '@/app/ui/wordmeaning';

  

export default function Page({params} : {params: { word: string}}) {
   
    const word = params.word; 



  

  return(
    <div>
        <WordMeaning word={word} />
    </div>
  )
}
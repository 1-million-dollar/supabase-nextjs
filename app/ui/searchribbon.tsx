import { createClient } from "@/utils/supabase/client"
import { InfiniteMovingCards } from "./aceternity/infinite-moving-caeds"

export default async function SearchRibbon() {

    let words: string[] = []

    const supabase = createClient()

    const {data, error} = await supabase
        .from('words')
        .select('word')
        .order('created_at', {ascending: false})
        .limit(10)

        if(data)
        {
            words = data.map((item: { word: string }) => item.word)
        }
        if (error) {
            console.log(error)
        }

    return (
        <div>
            <div className="h-max rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={words}
        direction="left"
        speed="fast"
      />
    </div>
           
        </div>
    )
}
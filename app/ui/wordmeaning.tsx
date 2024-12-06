import { notFound } from "next/navigation";
import { addSearchedWord, searchMeanings } from "../lib/data";
import { type User } from '@supabase/supabase-js'

import SearchBox from "./searchbox";
import { SpeakerWaveIcon } from "@heroicons/react/16/solid";

import Meanings from "./meanings";
import { createClient } from "@/utils/supabase/client";

type Definition = {
    definition: string;
    synonyms?: string;
    antonyms?: string;
    example?: string;
  };
  
  type Meaning = {
    partOfSpeech: string;
    definitions: Definition[];
  };


export default async function WordMeaning({ word, user }: { word: string, user: User }) {

    const supabase = createClient()
    const data_meaning = await searchMeanings(word)
    if (!data_meaning || data_meaning.length === 0 || data_meaning.title === "No Definitions Found") {
        return notFound();
      }

    
    
    console.log(user?.id)

      
    const { data, error } = await (await supabase)
        .from('words')
        .select('userID')
        .eq('word', word);

    if (error) {
        console.log(error)
    }

    if (data && data[0]?.userID === user?.id) {
        console.log('Duplicate found. Record already exists.', data);
    } else {
       
    const { error: insertError } = await (await supabase)
        .from('words')
        .insert([{ userID: user?.id, word: word }]);

    if (insertError) {
        console.error('Error inserting data:', insertError.message);
    } else {
        addSearchedWord(word)
        console.log('Data inserted successfully.');
        // create questions of the searched words
        }
    }
    
    const phoneticsText = data_meaning[0]?.phonetics?.[0]?.text || "";
    
    return (
        <div>
            <div className="flex justify-center p-2 md:p-5">
                <SearchBox />
            </div>
            <div className="flex items-center p-2 md:p-5">
                <div className="text-xl md:text-4xl font-bold">
                    {word}
                </div>
                <div className="flex flex-row items-center ml-auto">
                    {phoneticsText ?? ""}
                    <SpeakerWaveIcon className="w-8 p-1" />
                </div>
            </div>

            
            {data_meaning[0].meanings.map((meaning: Meaning, index: number) => (
                <div key={index} className="flex flex-col gap-4">
                    {meaning.definitions.map((definition: Definition, defindex: number) => (

                        <Meanings key={defindex} 
                            pos={meaning.partOfSpeech} 
                            def={definition.definition}
                            syn={definition.synonyms ?? ""}
                            ant={definition.antonyms ?? ""}
                            example={definition.example ?? ""}
                        />
                
                    ))}
                </div>
            ))}
        </div>
    )

}

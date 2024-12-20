"use client";



import { useState } from "react"

import { redirect } from "next/navigation";


import { PlaceholdersAndVanishInput } from "./aceternity/placeholders-and-vanish-input";

export default function SearchBox() {
    const [ word, setWord ] = useState('')

    const placeholders = [
      "creping",
  "crepe",
  "arguable",
  "argufier",
  "coreless",
  "cheapish",
  "beer can",
  "yard",
  "windrow",
  "amphoric",
  "amianth",
  "amidol",
  "briar",
  "chatting",
  "envoy",
  "degener"
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setWord(e.target.value)
    };
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (word){
        redirect(`/dictionary/${word}`)
      }
      
    };

    return (
        
            <div className="w-full h-max mt-10">
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleChange}
                onSubmit={onSubmit}
              />
       
            </div>
        
    )
}
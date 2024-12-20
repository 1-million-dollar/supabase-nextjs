'use client'

import { useState } from "react"

export default function Meanings({key, pos, def, syn, ant, example}: {
    key: number,
    pos: string,
    def: string,
    syn: string,
    ant: string,
    example: string,
}) {

    const [expanded, setExpanded] = useState(false)

    const toggleExpand = () => {
        setExpanded(!expanded);
      };
   //const formatedSyn = syn.join(', ')
   // const formatedAnt = ant.join(', ')
   console.log(syn)

    return (
        <div>
            <div key={key} onClick={toggleExpand} className="flex flex-col bg-blue-50 border-green-400 border-2 h-max w-full rounded-lg text-black p-2 md:p-5">
                    
                    

                    {!expanded ? (
                        <div>
                            <p className="second-text text-sm">{pos}</p>
                            <p className="text-md">{def}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <p>Parts of Speech: <b>{pos}</b></p>
                            <p>Meaning: <b>{def}</b></p>
                            <p>Synonyms: <b>{syn}</b></p>
                            <p>Antonyms: <b>{ant}</b></p>
                            <p>Example: <b><i>{example}</i></b></p>
                        </div>
                    )}
                </div>
        </div>
    )
}
// components/DictionarySearch.tsx
"use client";

import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function DictionarySearch() {

    interface Meaning {
        partOfSpeech: string;
        definition: string;
        example?: string; // Optional because some definitions may not have examples
      }

  const [word, setWord] = useState('')
  const [definition, setDefinition] = useState<any>(null)
  const [error, setError] = useState('')
  const [meanings, setMeanings] = useState<Meaning[]>([]);


  const handleSearch = async () => {
    
    setError('')
    setDefinition(null)

    if (!word) {
      setError('Please enter a word')
      return
    }


    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      if (!response.ok) {
        throw new Error('Word not found')
      }
      const data = await response.json()
      setMeanings(extractMeanings(data))
    } catch (err) {
      setError('Failed to fetch the definition for this word')
    }
  }

  function extractMeanings(data: any[]) {
    let meanings: { partOfSpeech: any; definition: any; example: any; }[] = [];
    data.forEach((entry) => {
      entry.meanings.forEach((meaning: { definitions: any[]; partOfSpeech: any; }) => {
        meaning.definitions.forEach((definition) => {
          meanings.push({
            partOfSpeech: meaning.partOfSpeech,
            definition: definition.definition,
            example: definition.example,
          });
        });
      });
    });
    return meanings;
  }

  return (
    <div className=''>

      <div className='flex flex-row items-center space-x-2'>
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className='flex rounded-2xl border-2 border-black p-4 md:w-[400px]'
          placeholder="Enter a word"
        />
        <button className='flex rounded-2xl p-4 border-2 border-green-800 bg-green-500' onClick={handleSearch}>Search</button>
      </div>
    
      {error && <p style={{ color: 'red' }}>{error}</p>}

      
      <div>
        <h3 className='text-green-500'>{word}</h3>
        {meanings.map((meaning, index) => (
        <div key={index}>
            <h3>{index + 1 }.</h3>
          <h4>{meaning.partOfSpeech}</h4>
          <p>{meaning.definition}</p>
          {meaning.example && <p><i>Example: {meaning.example}</i></p>}
        </div>
      ))}
    
      </div>
    </div>
  )
}

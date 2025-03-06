'use client'; // Mark this as a Client Component

import { useState } from 'react';

interface Error {
  message: string;
  context: { text: string };
  suggestions: string[];
}

export default function Home() {
  const [sentence, setSentence] = useState('');
  const [result, setResult] = useState<{
    isCorrect: boolean;
    errors?: Error[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkSentence = async () => {
    if (!sentence.trim()) {
      alert('Please enter a sentence.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/check-sentence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sentence }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while checking the sentence.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Sentence Correctness Checker</h1>
      <textarea
        className="w-full max-w-md p-2 border border-gray-300 rounded-lg mb-4"
        rows={4}
        placeholder="Enter a sentence..."
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
      />
      <button
        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
        onClick={checkSentence}
        disabled={isLoading}
      >
        {isLoading ? 'Checking...' : 'Check Sentence'}
      </button>

      {result && (
        <div className="mt-6 w-full max-w-md">
          {result.isCorrect ? (
            <p className="text-green-600 font-semibold">✅ The sentence is correct!</p>
          ) : (
            <div>
              <p className="text-red-600 font-semibold">❌ The sentence has errors:</p>
              <ul className="mt-2">
                {result.errors?.map((error, index) => (
                  <li key={index} className="mb-2">
                    <p className="text-gray-700">{error.message}</p>
                    <p className="text-gray-500">Context: {error.context.text}</p>
                    <p className="text-gray-500">
                      Suggestions: {error.suggestions.join(', ')}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
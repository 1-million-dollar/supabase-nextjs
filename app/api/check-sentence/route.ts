import { NextResponse } from 'next/server';

// Define types for the LanguageTool API response
interface LanguageToolMatch {
  message: string;
  context: {
    text: string;
    offset: number;
    length: number;
  };
  replacements: { value: string }[];
}

interface LanguageToolResponse {
  matches: LanguageToolMatch[];
}

export async function POST(request: Request) {
  // Parse the request body
  const { sentence } = await request.json();

  // Validate the input
  if (!sentence) {
    return NextResponse.json(
      { message: 'Sentence is required' },
      { status: 400 }
    );
  }

  try {
    // Call the LanguageTool API
    const response = await fetch(
      `https://api.languagetool.org/v2/check?text=${encodeURIComponent(
        sentence
      )}&language=en-US`
    );

    // Parse the API response
    const data: LanguageToolResponse = await response.json();

    // Check if there are any errors in the sentence
    if (data.matches.length > 0) {
      // Sentence has errors
      return NextResponse.json({
        isCorrect: false,
        errors: data.matches.map((match) => ({
          message: match.message,
          context: match.context,
          suggestions: match.replacements.map((replacement) => replacement.value),
        })),
      });
    } else {
      // Sentence is correct
      return NextResponse.json({ isCorrect: true });
    }
  } catch (error) {
    // Handle errors
    console.error('Error checking sentence:', error);
    return NextResponse.json(
      { message: 'Error checking sentence' },
      { status: 500 }
    );
  }
}
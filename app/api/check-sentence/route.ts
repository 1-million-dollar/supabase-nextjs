import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { sentence } = await request.json();

  if (!sentence) {
    return NextResponse.json(
      { message: 'Sentence is required' },
      { status: 400 }
    );
  }

  try {
    // Call LanguageTool API
    const response = await fetch(
      `https://api.languagetool.org/v2/check?text=${encodeURIComponent(
        sentence
      )}&language=en-US`
    );

    const data = await response.json();

    if (data.matches.length > 0) {
      // Sentence has errors
      return NextResponse.json({
        isCorrect: false,
        errors: data.matches.map((match: any) => ({
          message: match.message,
          context: match.context,
          suggestions: match.replacements,
        })),
      });
    } else {
      // Sentence is correct
      return NextResponse.json({ isCorrect: true });
    }
  } catch (error) {
    console.error('Error checking sentence:', error);
    return NextResponse.json(
      { message: 'Error checking sentence' },
      { status: 500 }
    );
  }
}
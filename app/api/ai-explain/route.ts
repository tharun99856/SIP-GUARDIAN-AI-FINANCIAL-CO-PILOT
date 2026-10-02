import { NextRequest, NextResponse } from 'next/server';

interface AIExplainRequest {
  monthlyAmount: number;
  currentValue: number;
  goalAmount: number;
  yearsToGoal: number;
  action: string;
  reason: string;
  delta: number;
  percentOfGoal: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: AIExplainRequest = await request.json();
    const { monthlyAmount, delta, action, reason, percentOfGoal } = body;

    const geminiKey = process.env.GEMINI_API_KEY;

    if (!geminiKey) {
      // Return fallback immediately
      return NextResponse.json({
        message: generateFallbackMessage(body),
      });
    }

    const prompt = buildPrompt(body);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 200,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Gemini API failed');
      }

      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Validate: AI should not invent numbers
      const validated = validateAIResponse(aiText, body);

      return NextResponse.json({
        message: validated || generateFallbackMessage(body),
      });
    } catch (error) {
      // Fallback on any error
      return NextResponse.json({
        message: generateFallbackMessage(body),
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

function buildPrompt(data: AIExplainRequest): string {
  const { monthlyAmount, delta, action, reason, percentOfGoal } = data;

  const formatMoney = (num: number) => {
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lakh`;
    }
    return `₹${num.toLocaleString('en-IN')}`;
  };

  return `You are explaining a financial decision to an Indian retail investor.

VERIFIED NUMBERS (do not change these):
- Monthly SIP: ${formatMoney(monthlyAmount)}
- Wealth loss from this action: ${formatMoney(delta)}
- Goal completion: ${percentOfGoal.toFixed(1)}%
- Action: ${action}
- Reason: ${reason}

Write 2-3 sentences in plain language explaining what this means. Be calm and specific. Do not use exclamation marks. Do not invent any numbers not provided above. Focus on what they are giving up.

Output only the message, no preamble.`;
}

function validateAIResponse(text: string, data: AIExplainRequest): string | null {
  // Check if AI invented numbers not in the input
  const inputNumbers = [
    data.monthlyAmount,
    data.delta,
    data.percentOfGoal,
  ];

  // Extract all numbers from AI response
  const numbersInResponse = text.match(/\d{1,3}(,\d{3})*(\.\d+)?/g) || [];

  // If AI generated numbers that don't match input (with some tolerance), reject
  // This is a basic check - in production you'd want more sophisticated validation
  
  return text; // Accept for now, can add stricter validation later
}

function generateFallbackMessage(data: AIExplainRequest): string {
  const { delta, action, monthlyAmount, percentOfGoal } = data;

  const formatMoney = (num: number) => {
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lakh`;
    }
    return `₹${num.toLocaleString('en-IN')}`;
  };

  if (action === 'cancel') {
    return `Stopping your SIP now means losing ${formatMoney(delta)} in potential wealth. This loss comes from missing both future contributions and the compounding returns on that money. You will reach only ${percentOfGoal.toFixed(0)}% of your goal.`;
  } else if (action === 'pause') {
    return `Pausing for 6 months reduces your projected corpus by ${formatMoney(delta)}. The main impact is not the contributions you skip, but the compounding growth you miss during that period. Your goal completion drops to ${percentOfGoal.toFixed(0)}%.`;
  } else {
    return `Reducing your SIP to ${formatMoney(monthlyAmount / 2)}/month costs you ${formatMoney(delta)} in long-term wealth. Smaller contributions mean less money compounding over time. You will reach ${percentOfGoal.toFixed(0)}% of your goal at this rate.`;
  }
}

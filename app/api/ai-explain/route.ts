import { NextRequest, NextResponse } from 'next/server';
import { SIPDetails, SIPAction, ImpactCalculation, AIExplanation } from '@/types';

/**
 * AI Explanation API Route
 * Generates simple language explanations of SIP impact calculations
 * 
 * IMPORTANT: AI only explains verified calculations, doesn't generate numbers
 */

export async function POST(request: NextRequest) {
  try {
    const { sipDetails, action, impactCalculation } = await request.json();

    // Validate input
    if (!sipDetails || !action || !impactCalculation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate AI explanation
    const explanation = await generateAIExplanation(
      sipDetails,
      action,
      impactCalculation
    );

    return NextResponse.json(explanation);
  } catch (error) {
    console.error('AI Explanation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate explanation' },
      { status: 500 }
    );
  }
}

async function generateAIExplanation(
  sipDetails: SIPDetails,
  action: SIPAction,
  impactCalculation: ImpactCalculation
): Promise<AIExplanation> {
  const { originalProjection, projectedImpact, assumptions } = impactCalculation;
  
  const difference = originalProjection.finalAmount - projectedImpact.finalAmount;
  const monthlyAmount = sipDetails.monthlyAmount;
  const goalName = sipDetails.goalName || 'financial goal';
  const goalAmount = sipDetails.goalAmount;

  // Check which AI provider is configured
  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!openaiKey && !anthropicKey && !geminiKey) {
    // Fallback to template-based explanation if no AI is configured
    return generateTemplateExplanation(
      sipDetails,
      action,
      impactCalculation
    );
  }

  try {
    // Prepare the prompt for AI
    const prompt = `
You are a financial education assistant helping investors understand the impact of their SIP (Systematic Investment Plan) decisions. Your job is to explain complex calculations in simple, empathetic language.

Context:
- Investor has a SIP of ₹${monthlyAmount.toLocaleString('en-IN')}/month
- Fund: ${sipDetails.fundName} (${sipDetails.fundType})
- Goal: ${goalName}${goalAmount ? ` of ₹${goalAmount.toLocaleString('en-IN')}` : ''}
- Current portfolio value: ₹${sipDetails.currentValue?.toLocaleString('en-IN') || 0}
- Action: ${action.toUpperCase()} the SIP

Verified Calculations (DO NOT modify these numbers):
- If continued: ₹${originalProjection.finalAmount.toLocaleString('en-IN')}
- After ${action}: ₹${projectedImpact.finalAmount.toLocaleString('en-IN')}
- Difference: ₹${difference.toLocaleString('en-IN')}
- Expected return: ${assumptions.expectedReturn}% annually
- Time impact: ${originalProjection.timeToGoal} months vs ${projectedImpact.timeToGoal} months

Task:
1. Write a 2-3 sentence summary explaining what this change means in simple language
2. List 3-4 key points the investor should understand
3. Identify 2-3 risk factors to consider
4. Write a detailed explanation (150-200 words) that helps them understand:
   - Why the difference is so large (compounding effect)
   - What they're giving up by making this change
   - The time value of money concept

Rules:
- Be empathetic and non-judgmental
- Use simple language (avoid jargon)
- Don't give investment advice or recommendations
- Don't tell them what to do
- Focus on helping them understand the numbers
- Be honest about uncertainties
- Explain that projections are based on assumptions

Return ONLY a JSON object with this structure:
{
  "summary": "2-3 sentence summary",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "riskFactors": ["risk 1", "risk 2", "risk 3"],
  "detailedExplanation": "150-200 word explanation",
  "confidence": "high" | "medium" | "low"
}
`.trim();

    let aiResponse: any;

    // Use Gemini if available (free tier!)
    if (geminiKey) {
      aiResponse = await callGemini(prompt, geminiKey);
    }
    // Otherwise use OpenAI if available
    else if (openaiKey) {
      aiResponse = await callOpenAI(prompt, openaiKey);
    } 
    // Otherwise use Anthropic
    else if (anthropicKey) {
      aiResponse = await callAnthropic(prompt, anthropicKey);
    }

    // Parse and validate AI response
    const explanation = parseAIResponse(aiResponse);
    
    return explanation;
  } catch (error) {
    console.error('AI generation failed, using template:', error);
    return generateTemplateExplanation(sipDetails, action, impactCalculation);
  }
}

async function callOpenAI(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a financial education assistant. Explain calculations clearly without giving investment advice.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function callAnthropic(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

function parseAIResponse(response: string): AIExplanation {
  try {
    // Extract JSON from response (in case AI added extra text)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      summary: parsed.summary || '',
      detailedExplanation: parsed.detailedExplanation || '',
      keyPoints: parsed.keyPoints || [],
      riskFactors: parsed.riskFactors || [],
      confidence: parsed.confidence || 'medium',
    };
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    throw error;
  }
}

function generateTemplateExplanation(
  sipDetails: SIPDetails,
  action: SIPAction,
  impactCalculation: ImpactCalculation
): AIExplanation {
  const { originalProjection, projectedImpact } = impactCalculation;
  const difference = originalProjection.finalAmount - projectedImpact.finalAmount;
  const percentLoss = ((difference / originalProjection.finalAmount) * 100).toFixed(1);

  const actionText = {
    cancel: 'stopping',
    pause: 'pausing',
    reduce: 'reducing',
  }[action];

  const summary = `If you ${actionText === 'stopping' ? 'cancel' : actionText === 'pausing' ? 'pause' : 'reduce'} this SIP now, you could end up with ₹${difference.toLocaleString('en-IN')} less than planned. That's ${percentLoss}% of your target gone. The math is simple—less time in the market means missing out on compounding returns. Every month your money sits invested, it has the chance to grow not just from new contributions, but from returns earning their own returns.`;

  const keyPoints = [
    `Your final corpus drops by ₹${difference.toLocaleString('en-IN')}—that's ${percentLoss}% less wealth`,
    `Most of this loss isn't from skipping payments—it's from missing compound growth on those payments`,
    `Restarting later won't fully recover this. You'd need much higher contributions to catch up`,
    `Markets have historically rewarded patience. Short-term thinking often backfires`,
  ];

  const riskFactors = [
    'Market swings: Actual returns could be higher or lower than the ${impactCalculation.assumptions.expectedReturn}% we're projecting',
    'Inflation: What you can buy with this money years from now depends on how prices change',
    'Timing trap: People who pause during dips usually miss the recovery that follows',
  ];

  const detailedExplanation = `Let's break down where that ₹${difference.toLocaleString('en-IN')} loss comes from. First, you're skipping ₹${(originalProjection.totalInvestment - projectedImpact.totalInvestment).toLocaleString('en-IN')} in payments. But here's what really hurts: you're also giving up ₹${(difference - (originalProjection.totalInvestment - projectedImpact.totalInvestment)).toLocaleString('en-IN')} in potential growth on that money.

Compounding is what makes long-term investing work. Think of it like planting trees—each year they grow taller, and each year's growth adds to the next. Stop planting now, and you're not just missing a few saplings; you're missing decades of growth from those trees.

Here's the tough reality: if you ${action === 'cancel' ? 'stop completely' : action === 'pause' ? 'pause for months' : 'cut your contributions'} and then change your mind later, catching up becomes much harder. You'd need to invest more each month just to get back on track.

We're assuming ${impactCalculation.assumptions.expectedReturn}% annual returns based on how ${sipDetails.fundType} funds have performed historically. Reality might differ—markets go up and down. But the principle holds: time in the market beats timing the market. Past data shows investors who stayed consistent through ups and downs ended up ahead of those who tried to jump in and out.`;

  return {
    summary,
    detailedExplanation,
    keyPoints,
    riskFactors,
    confidence: 'high',
  };
}

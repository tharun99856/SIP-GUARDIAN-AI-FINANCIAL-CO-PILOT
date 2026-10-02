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

  if (!openaiKey && !anthropicKey) {
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

    // Use OpenAI if available
    if (openaiKey) {
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

  const summary = `By ${actionText} your SIP, you could miss out on approximately ₹${difference.toLocaleString('en-IN')} in wealth creation. This is because you'll lose the power of compounding—where your returns generate their own returns over time. The earlier you invest, the more time your money has to grow exponentially.`;

  const keyPoints = [
    `You'll have ${percentLoss}% less wealth at the end of your investment journey`,
    `The majority of this loss comes from missed compounding, not just the contributions you skip`,
    `Market timing is difficult—continuing to invest during downturns often leads to better long-term results`,
    `Your ${sipDetails.goalName || 'financial goal'} may be delayed or harder to achieve`,
  ];

  const riskFactors = [
    'Market volatility: Returns may be higher or lower than projected',
    'Inflation impact: Future purchasing power may differ from today',
    'Behavioral risk: Stopping SIPs during downturns often means missing recovery',
  ];

  const detailedExplanation = `
The ₹${difference.toLocaleString('en-IN')} difference comes from two sources: the money you won't invest (₹${(originalProjection.totalInvestment - projectedImpact.totalInvestment).toLocaleString('en-IN')}), and more importantly, the returns you'll miss on that money (₹${(difference - (originalProjection.totalInvestment - projectedImpact.totalInvestment)).toLocaleString('en-IN')}).

This is the power of compounding—Albert Einstein reportedly called it the "eighth wonder of the world." Every rupee you invest today has the potential to multiply over time. When you stop investing, you're not just losing your contributions; you're losing all the future growth those contributions would have generated.

Consider this: If you stop now and restart later, you'll need to invest significantly more per month to catch up. The best time to invest was yesterday; the second best time is today. These projections assume ${impactCalculation.assumptions.expectedReturn}% annual returns based on historical ${sipDetails.fundType} fund performance, but remember that past performance doesn't guarantee future results.
  `.trim();

  return {
    summary,
    detailedExplanation,
    keyPoints,
    riskFactors,
    confidence: 'high',
  };
}

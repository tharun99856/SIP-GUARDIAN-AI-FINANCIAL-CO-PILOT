/**
 * Deterministic SIP Calculation Engine
 * All calculations are transparent and verifiable
 * No AI involved - pure mathematical projections
 */

import { ImpactCalculation, SIPDetails, SIPAction } from '@/types';

/**
 * Calculate future value of SIP using compound interest formula
 * FV = P × [(1 + r)^n - 1] / r × (1 + r)
 * Where: P = monthly investment, r = monthly rate, n = number of months
 */
function calculateSIPFutureValue(
  monthlyAmount: number,
  annualReturnRate: number,
  months: number
): number {
  if (months === 0) return 0;
  
  const monthlyRate = annualReturnRate / 12 / 100;
  
  if (monthlyRate === 0) {
    return monthlyAmount * months;
  }
  
  const futureValue =
    monthlyAmount *
    (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
  
  return Math.round(futureValue * 100) / 100;
}

/**
 * Calculate time required to reach a goal amount
 */
function calculateMonthsToGoal(
  monthlyAmount: number,
  annualReturnRate: number,
  goalAmount: number,
  currentValue: number = 0
): number {
  if (monthlyAmount <= 0) return Infinity;
  
  const monthlyRate = annualReturnRate / 12 / 100;
  
  // If we're already at or past the goal
  if (currentValue >= goalAmount) return 0;
  
  const targetRemaining = goalAmount - currentValue;
  
  // Approximate using logarithms
  if (monthlyRate > 0) {
    const months = Math.log(
      (targetRemaining * monthlyRate) / monthlyAmount + 1
    ) / Math.log(1 + monthlyRate);
    
    return Math.ceil(months);
  } else {
    return Math.ceil(targetRemaining / monthlyAmount);
  }
}

/**
 * Calculate impact of SIP change on investment goals
 */
export function calculateSIPImpact(
  sipDetails: SIPDetails,
  action: SIPAction,
  newAmount?: number,
  pauseDuration?: number
): ImpactCalculation {
  // Default assumptions - can be customized based on fund type
  const expectedReturn = sipDetails.fundType === 'equity' ? 12 : 8;
  const inflationRate = 6;
  
  const currentValue = sipDetails.currentValue || 0;
  const monthlyAmount = sipDetails.monthlyAmount;
  
  // Calculate original projection
  const goalDate = sipDetails.goalDate ? new Date(sipDetails.goalDate) : null;
  const startDate = new Date(sipDetails.startDate);
  const today = new Date();
  
  const monthsInvested = Math.max(
    0,
    (today.getFullYear() - startDate.getFullYear()) * 12 +
      (today.getMonth() - startDate.getMonth())
  );
  
  const remainingMonths = goalDate
    ? Math.max(
        0,
        (goalDate.getFullYear() - today.getFullYear()) * 12 +
          (goalDate.getMonth() - today.getMonth())
      )
    : 120; // Default 10 years
  
  // Original projection
  const originalFutureValue = calculateSIPFutureValue(
    monthlyAmount,
    expectedReturn,
    remainingMonths
  );
  
  const originalFinalAmount = currentValue + originalFutureValue;
  const originalTotalInvestment = monthlyAmount * remainingMonths;
  const originalReturns = originalFutureValue - originalTotalInvestment;
  
  const originalTimeToGoal = sipDetails.goalAmount
    ? calculateMonthsToGoal(
        monthlyAmount,
        expectedReturn,
        sipDetails.goalAmount,
        currentValue
      )
    : remainingMonths;
  
  // Calculate impact based on action
  let projectedFinalAmount: number;
  let projectedTotalInvestment: number;
  let projectedTimeToGoal: number;
  
  switch (action) {
    case 'cancel':
      // Only current value grows with market returns
      projectedFinalAmount =
        currentValue * Math.pow(1 + expectedReturn / 100, remainingMonths / 12);
      projectedTotalInvestment = 0;
      projectedTimeToGoal = Infinity;
      break;
    
    case 'pause':
      const pauseMonths = pauseDuration || 0;
      const remainingAfterPause = Math.max(0, remainingMonths - pauseMonths);
      
      // Current value grows during pause
      const valueAfterPause =
        currentValue * Math.pow(1 + expectedReturn / 100, pauseMonths / 12);
      
      // Then resume SIP
      const futureValueAfterResume = calculateSIPFutureValue(
        monthlyAmount,
        expectedReturn,
        remainingAfterPause
      );
      
      projectedFinalAmount = valueAfterPause + futureValueAfterResume;
      projectedTotalInvestment = monthlyAmount * remainingAfterPause;
      projectedTimeToGoal = sipDetails.goalAmount
        ? pauseMonths +
          calculateMonthsToGoal(
            monthlyAmount,
            expectedReturn,
            sipDetails.goalAmount,
            valueAfterPause
          )
        : remainingMonths;
      break;
    
    case 'reduce':
      const reducedAmount = newAmount || monthlyAmount * 0.5;
      const reducedFutureValue = calculateSIPFutureValue(
        reducedAmount,
        expectedReturn,
        remainingMonths
      );
      
      projectedFinalAmount = currentValue + reducedFutureValue;
      projectedTotalInvestment = reducedAmount * remainingMonths;
      projectedTimeToGoal = sipDetails.goalAmount
        ? calculateMonthsToGoal(
            reducedAmount,
            expectedReturn,
            sipDetails.goalAmount,
            currentValue
          )
        : remainingMonths;
      break;
  }
  
  const projectedReturns = projectedFinalAmount - currentValue - projectedTotalInvestment;
  const shortfall = sipDetails.goalAmount
    ? Math.max(0, sipDetails.goalAmount - projectedFinalAmount)
    : 0;
  
  return {
    originalProjection: {
      finalAmount: Math.round(originalFinalAmount),
      totalInvestment: Math.round(originalTotalInvestment),
      estimatedReturns: Math.round(originalReturns),
      timeToGoal: originalTimeToGoal,
    },
    projectedImpact: {
      finalAmount: Math.round(projectedFinalAmount),
      totalInvestment: Math.round(projectedTotalInvestment),
      estimatedReturns: Math.round(projectedReturns),
      timeToGoal: projectedTimeToGoal,
      shortfall: Math.round(shortfall),
    },
    assumptions: {
      expectedReturn,
      inflationRate,
      marketScenario: 'moderate',
    },
    calculationMethod: `
      Calculation Method:
      - Future Value Formula: FV = P × [(1 + r)^n - 1] / r × (1 + r)
      - Expected Annual Return: ${expectedReturn}% (${sipDetails.fundType} fund average)
      - Current Portfolio Value: ₹${currentValue.toLocaleString('en-IN')}
      - Months Remaining: ${remainingMonths}
      - All projections assume consistent returns (actual returns will vary)
    `.trim(),
  };
}

/**
 * Generate alternative options based on the requested action
 */
export function generateAlternatives(
  sipDetails: SIPDetails,
  action: SIPAction,
  currentCalculation: ImpactCalculation
): Array<any> {
  const alternatives = [];
  
  // Alternative 1: Reduce instead of cancel
  if (action === 'cancel') {
    const reducedAmount = sipDetails.monthlyAmount * 0.5;
    const reducedImpact = calculateSIPImpact(
      sipDetails,
      'reduce',
      reducedAmount
    );
    
    alternatives.push({
      id: 'reduce-50',
      type: 'reduce',
      title: `Reduce to ₹${reducedAmount.toLocaleString('en-IN')}/month`,
      description: 'Continue investing at a lower amount instead of stopping completely',
      impact: {
        shortfall: reducedImpact.projectedImpact.shortfall,
        monthsSaved: 0,
        finalAmount: reducedImpact.projectedImpact.finalAmount,
      },
      pros: [
        'Maintains investment discipline',
        'Keeps compounding benefits active',
        `Reduces shortfall from ₹${currentCalculation.projectedImpact.shortfall.toLocaleString('en-IN')} to ₹${reducedImpact.projectedImpact.shortfall.toLocaleString('en-IN')}`,
      ],
      cons: [
        `Still requires ₹${reducedAmount.toLocaleString('en-IN')} monthly commitment`,
        'Goal achievement delayed',
      ],
    });
  }
  
  // Alternative 2: Pause instead of cancel
  if (action === 'cancel') {
    const pauseImpact = calculateSIPImpact(sipDetails, 'pause', undefined, 6);
    
    alternatives.push({
      id: 'pause-6',
      type: 'pause',
      title: 'Pause for 6 months',
      description: 'Take a break and resume your SIP when ready',
      impact: {
        shortfall: pauseImpact.projectedImpact.shortfall,
        monthsSaved: 6,
        finalAmount: pauseImpact.projectedImpact.finalAmount,
      },
      pros: [
        'Zero investment for 6 months',
        'Automatic resumption option',
        'Existing investment continues to grow',
      ],
      cons: [
        'Misses 6 months of market averaging',
        'Goal achievement delayed by ~6 months',
      ],
    });
  }
  
  // Alternative 3: Build emergency fund first
  alternatives.push({
    id: 'emergency-fund',
    type: 'emergency-fund',
    title: 'Build Emergency Fund Separately',
    description: 'Keep SIP active while building emergency corpus in liquid fund',
    impact: {
      shortfall: currentCalculation.originalProjection.finalAmount - currentCalculation.projectedImpact.finalAmount,
      monthsSaved: 0,
      finalAmount: currentCalculation.originalProjection.finalAmount,
    },
    pros: [
      'Maintains long-term wealth creation',
      'Separate emergency cushion',
      'No impact on financial goals',
    ],
    cons: [
      'Requires additional monthly allocation',
      'Short-term cash flow pressure',
    ],
  });
  
  return alternatives;
}

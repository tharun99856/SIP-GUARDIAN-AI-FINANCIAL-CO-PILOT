/**
 * SIP Math Engine - Pure deterministic calculations
 * No AI, no external dependencies, fully unit-testable
 */

export interface SIPInputs {
  monthlyAmount: number;
  currentCorpus: number;
  yearsToGoal: number;
  assumedAnnualReturn: number; // in percentage (e.g., 12 for 12%)
}

export interface SIPScenario {
  name: string;
  description: string;
  finalCorpus: number;
  totalInvested: number;
  totalReturns: number;
  deltaVsContinue: number;
  percentOfGoal: number;
  monthsDelayToGoal: number | null;
}

export interface SIPComparison {
  continue: SIPScenario;
  pause: SIPScenario;
  reduce: SIPScenario;
  cancel: SIPScenario;
  goalAmount: number;
}

/**
 * Calculate future value of SIP
 * Formula: FV = P * (((1+i)^n - 1) / i) * (1+i)
 * Where: P = monthly investment, i = monthly rate, n = number of months
 */
export function calculateSIPFutureValue(
  monthlyAmount: number,
  annualReturnPercent: number,
  months: number
): number {
  if (monthlyAmount === 0 || months === 0) return 0;
  
  const monthlyRate = annualReturnPercent / 12 / 100;
  
  if (monthlyRate === 0) {
    // No returns, just sum of investments
    return monthlyAmount * months;
  }
  
  const numerator = Math.pow(1 + monthlyRate, months) - 1;
  const denominator = monthlyRate;
  const fv = monthlyAmount * (numerator / denominator) * (1 + monthlyRate);
  
  return Math.round(fv);
}

/**
 * Calculate future value of existing corpus
 * Formula: FV = PV * (1+i)^n
 */
export function calculateCorpusGrowth(
  currentCorpus: number,
  annualReturnPercent: number,
  months: number
): number {
  if (currentCorpus === 0 || months === 0) return currentCorpus;
  
  const monthlyRate = annualReturnPercent / 12 / 100;
  const fv = currentCorpus * Math.pow(1 + monthlyRate, months);
  
  return Math.round(fv);
}

/**
 * Calculate total corpus: existing corpus growth + new SIP contributions
 */
export function calculateTotalCorpus(
  currentCorpus: number,
  monthlyAmount: number,
  annualReturnPercent: number,
  months: number
): number {
  const corpusGrowth = calculateCorpusGrowth(currentCorpus, annualReturnPercent, months);
  const sipContributions = calculateSIPFutureValue(monthlyAmount, annualReturnPercent, months);
  
  return corpusGrowth + sipContributions;
}

/**
 * Calculate months needed to reach goal amount
 * Returns null if goal is unreachable with given parameters
 */
export function calculateMonthsToGoal(
  currentCorpus: number,
  monthlyAmount: number,
  goalAmount: number,
  annualReturnPercent: number,
  maxMonths: number = 600 // 50 years max
): number | null {
  if (goalAmount <= currentCorpus) return 0;
  
  // Binary search for the number of months needed
  let low = 1;
  let high = maxMonths;
  let result: number | null = null;
  
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const corpus = calculateTotalCorpus(currentCorpus, monthlyAmount, annualReturnPercent, mid);
    
    if (corpus >= goalAmount) {
      result = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  
  return result;
}

/**
 * Main comparison function: calculate all scenarios
 */
export function compareScenarios(
  inputs: SIPInputs,
  goalAmount: number,
  pauseMonths: number = 6,
  reductionAmount: number = 5000
): SIPComparison {
  const { monthlyAmount, currentCorpus, yearsToGoal, assumedAnnualReturn } = inputs;
  const totalMonths = yearsToGoal * 12;
  
  // Scenario 1: Continue as planned
  const continueFinalCorpus = calculateTotalCorpus(
    currentCorpus,
    monthlyAmount,
    assumedAnnualReturn,
    totalMonths
  );
  const continueTotalInvested = monthlyAmount * totalMonths;
  const continueTotalReturns = continueFinalCorpus - continueTotalInvested - currentCorpus;
  
  const continueScenario: SIPScenario = {
    name: 'Continue',
    description: 'Keep investing as planned',
    finalCorpus: continueFinalCorpus,
    totalInvested: continueTotalInvested,
    totalReturns: continueTotalReturns,
    deltaVsContinue: 0,
    percentOfGoal: (continueFinalCorpus / goalAmount) * 100,
    monthsDelayToGoal: null,
  };
  
  // Scenario 2: Pause for N months
  const corpusAfterPause = calculateCorpusGrowth(currentCorpus, assumedAnnualReturn, pauseMonths);
  const remainingMonths = totalMonths - pauseMonths;
  const pauseFinalCorpus = calculateTotalCorpus(
    corpusAfterPause,
    monthlyAmount,
    assumedAnnualReturn,
    remainingMonths
  );
  const pauseTotalInvested = monthlyAmount * remainingMonths;
  const pauseTotalReturns = pauseFinalCorpus - pauseTotalInvested - currentCorpus;
  const pauseMonthsToGoal = calculateMonthsToGoal(
    currentCorpus,
    monthlyAmount,
    goalAmount,
    assumedAnnualReturn
  );
  
  const pauseScenario: SIPScenario = {
    name: 'Pause',
    description: `Pause for ${pauseMonths} months, then resume`,
    finalCorpus: pauseFinalCorpus,
    totalInvested: pauseTotalInvested,
    totalReturns: pauseTotalReturns,
    deltaVsContinue: pauseFinalCorpus - continueFinalCorpus,
    percentOfGoal: (pauseFinalCorpus / goalAmount) * 100,
    monthsDelayToGoal: pauseMonthsToGoal ? pauseMonthsToGoal - totalMonths : null,
  };
  
  // Scenario 3: Reduce amount
  const reduceFinalCorpus = calculateTotalCorpus(
    currentCorpus,
    reductionAmount,
    assumedAnnualReturn,
    totalMonths
  );
  const reduceTotalInvested = reductionAmount * totalMonths;
  const reduceTotalReturns = reduceFinalCorpus - reduceTotalInvested - currentCorpus;
  const reduceMonthsToGoal = calculateMonthsToGoal(
    currentCorpus,
    reductionAmount,
    goalAmount,
    assumedAnnualReturn
  );
  
  const reduceScenario: SIPScenario = {
    name: 'Reduce',
    description: `Reduce to ₹${formatIndianNumber(reductionAmount)}/month`,
    finalCorpus: reduceFinalCorpus,
    totalInvested: reduceTotalInvested,
    totalReturns: reduceTotalReturns,
    deltaVsContinue: reduceFinalCorpus - continueFinalCorpus,
    percentOfGoal: (reduceFinalCorpus / goalAmount) * 100,
    monthsDelayToGoal: reduceMonthsToGoal ? reduceMonthsToGoal - totalMonths : null,
  };
  
  // Scenario 4: Cancel completely
  const cancelFinalCorpus = calculateCorpusGrowth(currentCorpus, assumedAnnualReturn, totalMonths);
  const cancelTotalInvested = 0;
  const cancelTotalReturns = cancelFinalCorpus - currentCorpus;
  
  const cancelScenario: SIPScenario = {
    name: 'Cancel',
    description: 'Stop all future investments',
    finalCorpus: cancelFinalCorpus,
    totalInvested: cancelTotalInvested,
    totalReturns: cancelTotalReturns,
    deltaVsContinue: cancelFinalCorpus - continueFinalCorpus,
    percentOfGoal: (cancelFinalCorpus / goalAmount) * 100,
    monthsDelayToGoal: null, // Can't reach goal by canceling
  };
  
  return {
    continue: continueScenario,
    pause: pauseScenario,
    reduce: reduceScenario,
    cancel: cancelScenario,
    goalAmount,
  };
}

/**
 * Format number in Indian notation with Lakh/Crore
 */
export function formatIndianNumber(num: number): string {
  const absNum = Math.abs(num);
  
  if (absNum >= 10000000) {
    // Crore (1 Cr = 100 Lakh = 10 million)
    const crore = num / 10000000;
    return `${crore.toFixed(2)} Cr`;
  } else if (absNum >= 100000) {
    // Lakh (1 Lakh = 100,000)
    const lakh = num / 100000;
    return `${lakh.toFixed(2)} Lakh`;
  } else {
    // Format with Indian comma style: 12,34,567
    return num.toLocaleString('en-IN');
  }
}

/**
 * Format currency in rupees
 */
export function formatCurrency(num: number): string {
  return `₹${formatIndianNumber(num)}`;
}

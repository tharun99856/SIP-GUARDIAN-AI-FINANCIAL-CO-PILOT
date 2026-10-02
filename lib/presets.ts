import { SIPPreset } from '@/types';

export const SIP_PRESETS: SIPPreset[] = [
  {
    id: 'mid-career-retirement',
    name: 'Mid-Career Professional',
    description: 'Building retirement corpus over 10 years',
    monthlyAmount: 10000,
    currentValue: 280000,
    fundName: 'HDFC Equity Growth Fund',
    fundType: 'equity',
    goalName: 'Retirement Fund',
    goalAmount: 5000000,
    yearsToGoal: 10,
  },
  {
    id: 'young-house',
    name: 'First-Time Home Buyer',
    description: 'Saving for house down payment in 5 years',
    monthlyAmount: 15000,
    currentValue: 400000,
    fundName: 'ICICI Prudential Balanced Advantage Fund',
    fundType: 'hybrid',
    goalName: 'House Down Payment',
    goalAmount: 2000000,
    yearsToGoal: 5,
  },
  {
    id: 'parent-education',
    name: 'Parent with School-Age Child',
    description: 'Building education corpus for college in 8 years',
    monthlyAmount: 12000,
    currentValue: 500000,
    fundName: 'SBI Magnum Children Benefit Fund',
    fundType: 'equity',
    goalName: 'Child Education',
    goalAmount: 3000000,
    yearsToGoal: 8,
  },
];

export const REASON_LABELS: Record<string, string> = {
  market_falling: 'Market is falling',
  need_cash: 'I need cash for an expense',
  lost_income: 'I lost my job or my income dropped',
  unsure: 'I am not sure if SIPs work',
};

export const REASON_CONTEXTS: Record<string, string> = {
  market_falling:
    'SIPs use rupee-cost averaging. When prices fall, your fixed monthly amount buys more units. Historically, investors who continued during downturns ended with better long-term returns than those who stopped.',
  need_cash:
    'Short-term cash needs are real. Before stopping your SIP completely, consider if you can pause for a few months or reduce the amount temporarily while you handle the expense.',
  lost_income:
    'Job loss or income reduction is a serious situation. Protecting your emergency fund comes first. But if possible, even a small continued investment can make a large difference over time.',
  unsure:
    'SIPs work through compounding and disciplined investing. The numbers shown here are based on historical average returns, but markets do fluctuate. Stopping removes the chance for future growth.',
};

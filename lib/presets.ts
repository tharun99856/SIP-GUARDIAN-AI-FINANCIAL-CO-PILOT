import { SIPPreset } from '@/types';

export const SIP_PRESETS: SIPPreset[] = [
  {
    id: 'mid-career-retirement',
    name: 'Priya Sharma',
    description: 'IT Lead, 30, ₹10K SIP · Home Goal 2033',
    monthlyAmount: 10000,
    currentValue: 280000,
    fundName: 'Axis Bluechip Fund',
    fundType: 'equity',
    goalName: 'Home Down Payment',
    goalAmount: 5000000,
    yearsToGoal: 10,
  },
  {
    id: 'young-house',
    name: 'Rahul Mehta',
    description: 'First-time investor, 26, ₹5K SIP · Wealth building',
    monthlyAmount: 5000,
    currentValue: 120000,
    fundName: 'ICICI Prudential Balanced Advantage Fund',
    fundType: 'hybrid',
    goalName: 'Wealth Building',
    goalAmount: 1500000,
    yearsToGoal: 8,
  },
  {
    id: 'parent-education',
    name: 'Anita Joshi',
    description: 'Parent, 38, ₹25K SIP · Child education fund',
    monthlyAmount: 25000,
    currentValue: 850000,
    fundName: 'SBI Magnum Children Benefit Fund',
    fundType: 'equity',
    goalName: 'Child Education',
    goalAmount: 6000000,
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

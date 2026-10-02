export interface SIPDetails {
  sipId: string;
  investorId: string;
  monthlyAmount: number;
  startDate: string;
  fundName: string;
  fundType: 'equity' | 'debt' | 'hybrid';
  currentValue: number;
  goalName: string;
  goalAmount: number;
  goalDate: string;
}

export type SIPAction = 'cancel' | 'pause' | 'reduce';

export type PauseReason = 'market_falling' | 'need_cash' | 'lost_income' | 'unsure';

export interface ImpactCalculation {
  originalProjection: Projection;
  projectedImpact: Projection;
  assumptions: Assumptions;
}

export interface Projection {
  finalAmount: number;
  totalInvestment: number;
  totalReturns: number;
  timeToGoal: number;
}

export interface Assumptions {
  expectedReturn: number;
  timeHorizon: number;
  inflationRate?: number;
}

export interface Alternative {
  id: string;
  title: string;
  description: string;
  impact: string;
  pros: string[];
  cons: string[];
}

export interface AIExplanation {
  summary: string;
  detailedExplanation: string;
  keyPoints: string[];
  riskFactors: string[];
  confidence: 'high' | 'medium' | 'low';
}

export interface CheckpointData {
  sipDetails: SIPDetails;
  action: SIPAction;
  reason?: PauseReason;
  impactCalculation: ImpactCalculation;
  aiExplanation?: AIExplanation;
  alternatives: Alternative[];
  timestamp: number;
}

export interface SIPPreset {
  id: string;
  name: string;
  description: string;
  monthlyAmount: number;
  currentValue: number;
  fundName: string;
  fundType: 'equity' | 'debt' | 'hybrid';
  goalName: string;
  goalAmount: number;
  yearsToGoal: number;
}

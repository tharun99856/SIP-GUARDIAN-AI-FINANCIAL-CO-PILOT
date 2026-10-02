// Core SIP Types
export interface SIPDetails {
  sipId: string;
  investorId: string;
  monthlyAmount: number;
  startDate: string;
  fundName: string;
  fundType: string;
  currentValue?: number;
  goalName?: string;
  goalAmount?: number;
  goalDate?: string;
}

// Action Types
export type SIPAction = 'pause' | 'reduce' | 'cancel';

export interface SIPChangeRequest {
  action: SIPAction;
  sipDetails: SIPDetails;
  newAmount?: number; // For reduce action
  pauseDuration?: number; // In months, for pause action
  reason?: string;
}

// Calculation Results
export interface ImpactCalculation {
  originalProjection: {
    finalAmount: number;
    totalInvestment: number;
    estimatedReturns: number;
    timeToGoal: number; // months
  };
  projectedImpact: {
    finalAmount: number;
    totalInvestment: number;
    estimatedReturns: number;
    timeToGoal: number; // months
    shortfall: number; // vs goal
  };
  assumptions: {
    expectedReturn: number; // percentage
    inflationRate: number; // percentage
    marketScenario: 'conservative' | 'moderate' | 'optimistic';
  };
  calculationMethod: string;
}

// Alternative Suggestions
export interface Alternative {
  id: string;
  type: 'reduce' | 'pause' | 'switch' | 'emergency-fund';
  title: string;
  description: string;
  impact: {
    shortfall: number;
    monthsSaved: number;
    finalAmount: number;
  };
  pros: string[];
  cons: string[];
}

// AI Explanation
export interface AIExplanation {
  summary: string;
  detailedExplanation: string;
  keyPoints: string[];
  riskFactors: string[];
  confidence: 'high' | 'medium' | 'low';
}

// Checkpoint Screen Data
export interface CheckpointData {
  changeRequest: SIPChangeRequest;
  impactCalculation: ImpactCalculation;
  alternatives: Alternative[];
  aiExplanation: AIExplanation;
  effectiveDate: string;
}

// Analytics Events
export interface AnalyticsEvent {
  eventId: string;
  timestamp: string;
  userId: string;
  eventType: 'checkpoint_shown' | 'action_confirmed' | 'action_cancelled' | 'alternative_selected' | 'info_expanded';
  metadata: Record<string, any>;
  sessionId: string;
}

// Success Metrics
export interface SessionMetrics {
  sessionId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  originalAction: SIPAction;
  finalAction: SIPAction | 'cancelled';
  alternativeViewed: boolean;
  timeSpent: number; // seconds
  informedDecision: boolean;
  calculationAccuracy: number; // 0-1
  userFriction: 'low' | 'medium' | 'high';
}

/**
 * Shadow Mode Analytics Tracking System
 * Tracks user interactions and decisions without affecting actual transactions
 * Data collected for measuring success metrics and validating hypotheses
 */

import { AnalyticsEvent, SessionMetrics, SIPAction } from '@/types';

// Generate unique IDs
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Track events (client-side)
export async function trackEvent(
  eventType: AnalyticsEvent['eventType'],
  metadata: Record<string, any>,
  sessionId: string,
  userId: string
): Promise<void> {
  const event: AnalyticsEvent = {
    eventId: generateId(),
    timestamp: Date.now(),
    userId,
    eventType,
    data: metadata,
    sessionId,
  };

  try {
    // Send to analytics API
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });

    // Also log to console in development
    if (process.env.NEXT_PUBLIC_APP_ENV === 'development') {
      console.log('[Analytics]', eventType, metadata);
    }
  } catch (error) {
    console.error('Analytics tracking failed:', error);
    // Don't throw - analytics failures shouldn't break user experience
  }
}

// Start a checkpoint session
export function startCheckpointSession(
  userId: string,
  originalAction: SIPAction
): string {
  const sessionId = generateId();
  
  const sessionData = {
    sessionId,
    userId,
    startTime: new Date().toISOString(),
    originalAction,
  };

  // Store in session storage
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('checkpoint_session', JSON.stringify(sessionData));
  }

  // Track session start event
  trackEvent('checkpoint_shown', { originalAction }, sessionId, userId);

  return sessionId;
}

// Get current session
export function getCurrentSession(): any | null {
  if (typeof window === 'undefined') return null;
  
  const data = sessionStorage.getItem('checkpoint_session');
  return data ? JSON.parse(data) : null;
}

// End session and calculate metrics
export async function endCheckpointSession(
  finalAction: SIPAction | 'continue',
  alternativeViewed: boolean,
  additionalMetadata?: Record<string, any>
): Promise<void> {
  const session = getCurrentSession();
  if (!session) return;

  const endTime = new Date();
  const startTime = new Date(session.startTime);
  const timeSpent = Math.round((endTime.getTime() - startTime.getTime()) / 1000);

  const metrics: SessionMetrics = {
    sessionId: session.sessionId,
    userId: session.userId,
    timestamp: Date.now(),
    originalAction: session.originalAction,
    finalAction,
    timeSpent,
    completed: finalAction !== 'continue',
    informedDecision: timeSpent >= 15, // Heuristic: spent at least 15 seconds
    reason: session.reason,
  };

  // Send metrics to API
  await fetch('/api/analytics/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...metrics, ...additionalMetadata }),
  });

  // Track completion event
  await trackEvent(
    finalAction === 'continue' ? 'action_cancelled' : 'action_confirmed',
    { finalAction, timeSpent, alternativeViewed },
    session.sessionId,
    session.userId
  );

  // Clear session
  sessionStorage.removeItem('checkpoint_session');
}

// Track specific interactions
export async function trackAlternativeView(
  alternativeId: string,
  alternativeType: string
): Promise<void> {
  const session = getCurrentSession();
  if (!session) return;

  await trackEvent(
    'alternative_selected',
    { alternativeId, alternativeType },
    session.sessionId,
    session.userId
  );
}

export async function trackInfoExpansion(section: string): Promise<void> {
  const session = getCurrentSession();
  if (!session) return;

  await trackEvent(
    'info_expanded',
    { section },
    session.sessionId,
    session.userId
  );
}

// Calculate success metrics from stored data
export interface AggregatedMetrics {
  totalSessions: number;
  informedDecisionRate: number;
  averageTimeSpent: number;
  cancellationRate: number;
  alternativeSelectionRate: number;
  frictionDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  actionChangeRate: number; // % who changed from original action
}

export function calculateAggregatedMetrics(
  sessions: SessionMetrics[]
): AggregatedMetrics {
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      informedDecisionRate: 0,
      averageTimeSpent: 0,
      cancellationRate: 0,
      alternativeSelectionRate: 0,
      frictionDistribution: { low: 0, medium: 0, high: 0 },
      actionChangeRate: 0,
    };
  }

  const totalSessions = sessions.length;
  const informedDecisions = sessions.filter(s => s.informedDecision).length;
  const cancelled = sessions.filter(s => s.finalAction === 'continue').length;
  const actionChanged = sessions.filter(
    s => s.finalAction !== 'continue' && s.finalAction !== s.originalAction
  ).length;

  const totalTimeSpent = sessions.reduce((sum, s) => sum + s.timeSpent, 0);

  // Simplified friction calculation based on time spent
  const frictionCounts = sessions.reduce(
    (acc, s) => {
      const friction = s.timeSpent < 20 ? 'low' : s.timeSpent < 60 ? 'medium' : 'high';
      acc[friction]++;
      return acc;
    },
    { low: 0, medium: 0, high: 0 }
  );

  return {
    totalSessions,
    informedDecisionRate: (informedDecisions / totalSessions) * 100,
    averageTimeSpent: totalTimeSpent / totalSessions,
    cancellationRate: (cancelled / totalSessions) * 100,
    alternativeSelectionRate: 0, // Not tracked in SessionMetrics
    frictionDistribution: {
      low: (frictionCounts.low / totalSessions) * 100,
      medium: (frictionCounts.medium / totalSessions) * 100,
      high: (frictionCounts.high / totalSessions) * 100,
    },
    actionChangeRate: (actionChanged / totalSessions) * 100,
  };
}

// Export data for analysis
export function exportSessionData(sessions: SessionMetrics[]): string {
  const csv = [
    [
      'Session ID',
      'User ID',
      'Timestamp',
      'Original Action',
      'Final Action',
      'Time Spent (s)',
      'Informed Decision',
      'Completed',
      'Reason',
    ].join(','),
    ...sessions.map(s =>
      [
        s.sessionId,
        s.userId || '',
        s.timestamp,
        s.originalAction,
        s.finalAction,
        s.timeSpent,
        s.informedDecision,
        s.completed,
        s.reason || '',
      ].join(',')
    ),
  ].join('\n');

  return csv;
}

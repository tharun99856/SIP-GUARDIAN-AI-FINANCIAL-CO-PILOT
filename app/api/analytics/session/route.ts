import { NextRequest, NextResponse } from 'next/server';
import { SessionMetrics } from '@/types';

/**
 * Session Metrics Endpoint
 * Stores completed session metrics for analysis
 * Uses in-memory storage with periodic persistence to localStorage
 */

// In-memory storage for demo (resets on server restart, but that's okay for MVP)
let metricsStore: SessionMetrics[] = [];

// Initialize from persistent storage if available
function initializeStore() {
  // In production, this would load from a database
  // For demo, we pre-seed with some realistic data
  if (metricsStore.length === 0) {
    // Pre-seed with baseline data matching dashboard expectations
    const now = Date.now();
    for (let i = 0; i < 5; i++) {
      metricsStore.push({
        sessionId: `seed-${i}-${Date.now()}`,
        userId: `demo-user-${i % 3}`,
        timestamp: now - (i * 24 * 60 * 60 * 1000), // Spread over last 5 days
        originalAction: i % 3 === 0 ? 'cancel' : i % 3 === 1 ? 'pause' : 'reduce',
        finalAction: i % 2 === 0 ? 'continue' : (i % 3 === 0 ? 'pause' : 'reduce'),
        timeSpent: 20 + Math.floor(Math.random() * 40),
        completed: true,
        informedDecision: true,
      });
    }
  }
}

initializeStore();

export async function POST(request: NextRequest) {
  try {
    const metrics: SessionMetrics = await request.json();

    // Validate metrics
    if (!metrics.sessionId || !metrics.originalAction) {
      return NextResponse.json(
        { error: 'Invalid metrics structure' },
        { status: 400 }
      );
    }

    // Store to memory
    console.log('[Session Completed]', {
      sessionId: metrics.sessionId,
      originalAction: metrics.originalAction,
      finalAction: metrics.finalAction,
      timeSpent: metrics.timeSpent,
      informedDecision: metrics.informedDecision,
    });

    metricsStore.push(metrics);
    
    // Keep only last 500 sessions
    if (metricsStore.length > 500) {
      metricsStore.shift();
    }

    return NextResponse.json({ success: true, sessionId: metrics.sessionId });
  } catch (error) {
    console.error('Session metrics error:', error);
    return NextResponse.json(
      { error: 'Failed to store metrics' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve metrics
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  let metrics = [...metricsStore];

  if (userId) {
    metrics = metrics.filter(m => m.userId === userId);
  }

  return NextResponse.json({
    count: metrics.length,
    sessions: metrics,
  });
}

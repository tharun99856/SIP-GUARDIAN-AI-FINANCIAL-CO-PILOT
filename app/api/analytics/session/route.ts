import { NextRequest, NextResponse } from 'next/server';
import { SessionMetrics } from '@/types';

/**
 * Session Metrics Endpoint
 * Stores completed session metrics for analysis
 */

export async function POST(request: NextRequest) {
  try {
    const metrics: SessionMetrics = await request.json();

    // Validate metrics
    if (!metrics.sessionId || !metrics.userId || !metrics.originalAction) {
      return NextResponse.json(
        { error: 'Invalid metrics structure' },
        { status: 400 }
      );
    }

    // Store to database in production
    // await db.sessionMetrics.create({ data: metrics });

    // For now, log and store in memory
    console.log('[Session Completed]', {
      sessionId: metrics.sessionId,
      originalAction: metrics.originalAction,
      finalAction: metrics.finalAction,
      timeSpent: metrics.timeSpent,
      informedDecision: metrics.informedDecision,
    });

    storeMetricsToMemory(metrics);

    return NextResponse.json({ success: true, sessionId: metrics.sessionId });
  } catch (error) {
    console.error('Session metrics error:', error);
    return NextResponse.json(
      { error: 'Failed to store metrics' },
      { status: 500 }
    );
  }
}

// In-memory storage for demo
const metricsStore: SessionMetrics[] = [];

function storeMetricsToMemory(metrics: SessionMetrics): void {
  metricsStore.push(metrics);
  
  if (metricsStore.length > 500) {
    metricsStore.shift();
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

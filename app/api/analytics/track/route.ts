import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsEvent } from '@/types';

/**
 * Analytics Event Tracking Endpoint
 * Receives and stores analytics events in shadow mode
 * 
 * In production, this would store to a database
 * For now, we log to console and could store to file/database
 */

export async function POST(request: NextRequest) {
  try {
    const event: AnalyticsEvent = await request.json();

    // Validate event structure
    if (!event.eventId || !event.eventType || !event.sessionId || !event.userId) {
      return NextResponse.json(
        { error: 'Invalid event structure' },
        { status: 400 }
      );
    }

    // In production, store to database
    // await db.analyticsEvents.create({ data: event });

    // For now, log to console in development
    if (process.env.NEXT_PUBLIC_APP_ENV === 'development') {
      console.log('[Analytics Event]', {
        type: event.eventType,
        session: event.sessionId,
        timestamp: event.timestamp,
        metadata: event.metadata,
      });
    }

    // Store to in-memory cache or file system for demo
    // This is just for demonstration - use a real database in production
    storeEventToMemory(event);

    return NextResponse.json({ success: true, eventId: event.eventId });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}

// In-memory storage for demo purposes
// Replace with database in production
const eventStore: AnalyticsEvent[] = [];

function storeEventToMemory(event: AnalyticsEvent): void {
  eventStore.push(event);
  
  // Keep only last 1000 events in memory
  if (eventStore.length > 1000) {
    eventStore.shift();
  }
}

// GET endpoint to retrieve events (for demo/testing)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  const eventType = searchParams.get('eventType');

  let events = [...eventStore];

  if (sessionId) {
    events = events.filter(e => e.sessionId === sessionId);
  }

  if (eventType) {
    events = events.filter(e => e.eventType === eventType);
  }

  return NextResponse.json({
    count: events.length,
    events: events.slice(-100), // Return last 100 events
  });
}

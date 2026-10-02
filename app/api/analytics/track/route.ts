import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsEvent } from '@/types';

/**
 * Analytics Event Tracking Endpoint
 * Receives and stores analytics events in shadow mode
 * Uses in-memory storage for MVP (would use database in production)
 */

// In-memory storage for demo
let eventStore: AnalyticsEvent[] = [];

// Initialize with some realistic event data
function initializeEventStore() {
  if (eventStore.length === 0) {
    const now = Date.now();
    const eventTypes = ['checkpoint_shown', 'alternative_selected', 'action_confirmed', 'action_cancelled'];
    
    for (let i = 0; i < 10; i++) {
      eventStore.push({
        eventId: `seed-event-${i}-${Date.now()}`,
        eventType: eventTypes[i % eventTypes.length],
        sessionId: `seed-session-${Math.floor(i / 2)}`,
        userId: `demo-user-${i % 3}`,
        data: { demoEvent: true },
        timestamp: now - (i * 12 * 60 * 60 * 1000), // Spread over last 5 days
      });
    }
  }
}

initializeEventStore();

export async function POST(request: NextRequest) {
  try {
    const event: AnalyticsEvent = await request.json();

    // Validate event structure
    if (!event.eventId || !event.eventType || !event.sessionId) {
      return NextResponse.json(
        { error: 'Invalid event structure' },
        { status: 400 }
      );
    }

    // Log to console in development
    if (process.env.NEXT_PUBLIC_APP_ENV === 'development') {
      console.log('[Analytics Event]', {
        type: event.eventType,
        session: event.sessionId,
        timestamp: event.timestamp,
        data: event.data,
      });
    }

    // Store to memory
    eventStore.push(event);
    
    // Keep only last 1000 events
    if (eventStore.length > 1000) {
      eventStore.shift();
    }

    return NextResponse.json({ success: true, eventId: event.eventId });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve events
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

import { NextResponse } from 'next/server'

// Test webhook events to simulate WHOOP notifications
const testWebhookEvents = [
  {
    name: 'Sleep Completed',
    event_type: 'sleep_completed',
    description: 'Simulates when WHOOP finishes processing sleep data',
    payload: {
      event_type: 'sleep_completed',
      user_id: 'test_user_123',
      timestamp: new Date().toISOString(),
      data: {
        sleep_score: 85,
        sleep_duration: '8h 15m',
        deep_sleep: '2h 30m',
        rem_sleep: '1h 45m'
      }
    }
  },
  {
    name: 'Workout Completed',
    event_type: 'workout_completed',
    description: 'Simulates when WHOOP finishes processing workout data',
    payload: {
      event_type: 'workout_completed',
      user_id: 'test_user_123',
      timestamp: new Date().toISOString(),
      data: {
        steps: 12500,
        calories_burned: 450,
        workout_duration: '45m',
        strain_score: 12
      }
    }
  },
  {
    name: 'Recovery Updated',
    event_type: 'recovery_updated',
    description: 'Simulates when WHOOP updates recovery score',
    payload: {
      event_type: 'recovery_updated',
      user_id: 'test_user_123',
      timestamp: new Date().toISOString(),
      data: {
        recovery_score: 78,
        hrv_baseline: 45,
        resting_heart_rate: 58
      }
    }
  },
  {
    name: 'Strain Updated',
    event_type: 'strain_updated',
    description: 'Simulates when WHOOP updates daily strain',
    payload: {
      event_type: 'strain_updated',
      user_id: 'test_user_123',
      timestamp: new Date().toISOString(),
      data: {
        strain_score: 15,
        calories_burned: 3200,
        max_heart_rate: 175
      }
    }
  }
]

export async function GET() {
  return NextResponse.json({
    message: 'WHOOP Webhook Test Endpoint',
    status: 'ready',
    timestamp: new Date().toISOString(),
    available_tests: testWebhookEvents.map(event => ({
      name: event.name,
      event_type: event.event_type,
      description: event.description
    })),
    instructions: [
      '1. Use POST /api/whoop/webhook/test with event_type to test',
      '2. This will simulate WHOOP webhook and trigger Flow Agent',
      '3. Check console logs for verification process'
    ]
  })
}

export async function POST(request: Request) {
  try {
    const { event_type } = await request.json()
    
    if (!event_type) {
      return NextResponse.json({ 
        error: 'event_type is required' 
      }, { status: 400 })
    }
    
    // Find the test event
    const testEvent = testWebhookEvents.find(event => event.event_type === event_type)
    
    if (!testEvent) {
      return NextResponse.json({ 
        error: `Unknown event_type: ${event_type}`,
        available_types: testWebhookEvents.map(e => e.event_type)
      }, { status: 400 })
    }
    
    console.log(`🧪 Testing webhook with event: ${testEvent.name}`)
    
    // Simulate webhook call to our endpoint
    const webhookResponse = await fetch(`${request.nextUrl.origin}/api/whoop/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-whoop-signature': 'test_signature_123',
        'x-whoop-timestamp': new Date().toISOString()
      },
      body: JSON.stringify(testEvent.payload)
    })
    
    const webhookResult = await webhookResponse.json()
    
    return NextResponse.json({
      success: true,
      message: `Webhook test completed for ${testEvent.name}`,
      test_event: testEvent.name,
      webhook_result: webhookResult,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Error in webhook test:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

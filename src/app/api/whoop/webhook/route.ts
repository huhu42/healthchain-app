import { NextRequest, NextResponse } from 'next/server'
import { flowAgent } from '../../../../lib/flowAgent'

// WHOOP webhook event types
interface WhoopWebhookEvent {
  event_type: string
  user_id: string
  timestamp: string
  data?: any
}

// Webhook verification (WHOOP sends a signature)
interface WhoopWebhookRequest extends NextRequest {
  headers: {
    'x-whoop-signature'?: string
    'x-whoop-timestamp'?: string
  }
}

export async function POST(request: WhoopWebhookRequest) {
  try {
    console.log('🔔 WHOOP Webhook received')
    
    // Get webhook signature and timestamp for verification
    const signature = request.headers.get('x-whoop-signature')
    const timestamp = request.headers.get('x-whoop-timestamp')
    
    // Verify webhook authenticity (in production, verify WHOOP signature)
    if (!await verifyWhoopWebhook(request, signature, timestamp)) {
      console.log('⚠️ WHOOP webhook verification failed')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Parse webhook payload
    const webhookData: WhoopWebhookEvent = await request.json()
    console.log('📊 WHOOP Webhook data:', webhookData)
    
    // Handle different event types
    switch (webhookData.event_type) {
      case 'sleep_completed':
        console.log('😴 Sleep data updated, triggering verification...')
        await handleSleepUpdate(webhookData)
        break
        
      case 'workout_completed':
        console.log('🏃 Workout data updated, triggering verification...')
        await handleWorkoutUpdate(webhookData)
        break
        
      case 'recovery_updated':
        console.log('🔄 Recovery data updated, triggering verification...')
        await handleRecoveryUpdate(webhookData)
        break
        
      case 'strain_updated':
        console.log('⚡ Strain data updated, triggering verification...')
        await handleStrainUpdate(webhookData)
        break
        
      default:
        console.log(`📝 Unhandled WHOOP event: ${webhookData.event_type}`)
    }
    
    // Acknowledge webhook receipt
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      event_type: webhookData.event_type,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Error processing WHOOP webhook:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

// Verify WHOOP webhook authenticity
async function verifyWhoopWebhook(
  request: WhoopWebhookRequest, 
  signature: string | null, 
  timestamp: string | null
): Promise<boolean> {
  try {
    // In production, you would:
    // 1. Verify the timestamp is recent (within 5 minutes)
    // 2. Verify the signature using WHOOP's public key
    // 3. Check against replay attacks
    
    if (!signature || !timestamp) {
      console.log('⚠️ Missing webhook signature or timestamp')
      return false
    }
    
    // For development/testing, accept all webhooks
    // In production, implement proper signature verification
    console.log('🔐 Webhook verification passed (development mode)')
    return true
    
  } catch (error) {
    console.error('❌ Webhook verification error:', error)
    return false
  }
}

// Handle sleep data updates
async function handleSleepUpdate(webhookData: WhoopWebhookEvent) {
  try {
    console.log('😴 Processing sleep update...')
    
    // Trigger immediate verification for sleep-related goals
    await triggerGoalVerification('sleep', webhookData)
    
  } catch (error) {
    console.error('❌ Error handling sleep update:', error)
  }
}

// Handle workout data updates
async function handleWorkoutUpdate(webhookData: WhoopWebhookEvent) {
  try {
    console.log('🏃 Processing workout update...')
    
    // Trigger immediate verification for workout-related goals
    await triggerGoalVerification('workout', webhookData)
    
  } catch (error) {
    console.error('❌ Error handling workout update:', error)
  }
}

// Handle recovery data updates
async function handleRecoveryUpdate(webhookData: WhoopWebhookEvent) {
  try {
    console.log('🔄 Processing recovery update...')
    
    // Trigger immediate verification for recovery-related goals
    await triggerGoalVerification('recovery', webhookData)
    
  } catch (error) {
    console.error('❌ Error handling recovery update:', error)
  }
}

// Handle strain data updates
async function handleStrainUpdate(webhookData: WhoopWebhookEvent) {
  try {
    console.log('⚡ Processing strain update...')
    
    // Trigger immediate verification for strain-related goals
    await triggerGoalVerification('strain', webhookData)
    
  } catch (error) {
    console.error('❌ Error handling strain update:', error)
  }
}

// Trigger goal verification for specific health data type
async function triggerGoalVerification(healthDataType: string, webhookData: WhoopWebhookEvent) {
  try {
    console.log(`🎯 Triggering verification for ${healthDataType} goals...`)
    
    // Check if Flow Agent is running
    if (!flowAgent.getStatus().isRunning) {
      console.log('⚠️ Flow Agent not running, starting it...')
      await flowAgent.start()
    }
    
    // Trigger immediate verification for this data type
    await flowAgent.triggerVerificationForDataType(healthDataType, webhookData)
    
    console.log(`✅ Verification triggered for ${healthDataType} goals`)
    
  } catch (error) {
    console.error(`❌ Error triggering verification for ${healthDataType}:`, error)
  }
}

// GET endpoint for webhook testing
export async function GET() {
  return NextResponse.json({
    message: 'WHOOP Webhook endpoint is active',
    status: 'ready',
    timestamp: new Date().toISOString(),
    instructions: [
      '1. Configure WHOOP webhook to point to this endpoint',
      '2. Webhook will automatically trigger Flow Agent verification',
      '3. No more constant polling needed!'
    ]
  })
}

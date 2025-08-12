import clientPromise from '../../../lib/mongodb';
import { MessageProcessor } from '../../../lib/messageProcessor';

export async function POST(request) {
  try {
    const body = await request.json();
    
    const client = await clientPromise;
    const db = client.db('whatsapp');
    const processor = new MessageProcessor(db);
    
    const result = await processor.processMessage(body);
    
    if (result.success) {
      return Response.json({ message: 'Webhook processed successfully' });
    } else {
      return Response.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  // Webhook verification for WhatsApp
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    return new Response(challenge);
  }

  return Response.json({ error: 'Verification failed' }, { status: 403 });
}

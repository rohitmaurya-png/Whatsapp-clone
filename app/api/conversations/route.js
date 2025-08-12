import clientPromise from '../../../lib/mongodb';
import { MessageProcessor } from '../../../lib/messageProcessor';

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db('whatsapp');
    const processor = new MessageProcessor(db);
    
    const conversations = await processor.getConversations();
    
    return Response.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

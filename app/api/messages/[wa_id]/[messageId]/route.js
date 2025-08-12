import clientPromise from '../../../../../lib/mongodb';
import { MessageProcessor } from '../../../../../lib/messageProcessor';

export async function DELETE(request, { params }) {
  try {
    const { wa_id, messageId } = await params;
    
    console.log('Delete request received:', { wa_id, messageId });
    console.log('Full params object:', params);
    console.log('Request URL:', request.url);
    
    if (!wa_id || !messageId) {
      console.log('Missing parameters - wa_id:', wa_id, 'messageId:', messageId);
      return Response.json({ error: 'wa_id and messageId are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('whatsapp');
    const processor = new MessageProcessor(db);
    
    const result = await processor.deleteMessage(wa_id, messageId);
    
    console.log('Delete result:', result);
    
    if (result.success) {
      return Response.json({ message: 'Message deleted successfully' });
    } else {
      return Response.json({ error: result.error }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting message:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

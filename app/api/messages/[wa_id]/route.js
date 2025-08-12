import clientPromise from '../../../../lib/mongodb';
import { MessageProcessor } from '../../../../lib/messageProcessor';

export async function GET(request, { params }) {
  try {
    const { wa_id } = await params;
    
    const client = await clientPromise;
    const db = client.db('whatsapp');
    const processor = new MessageProcessor(db);
    
    const messages = await processor.getMessages(wa_id);
    
    return Response.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { wa_id } = await params;
    const { text, contactName, type, imageData } = await request.json();
    
    // Validate message content based on type
    if (type === 'image') {
      if (!imageData) {
        return Response.json({ error: 'Image data is required for image messages' }, { status: 400 });
      }
    } else {
      if (!text?.trim()) {
        return Response.json({ error: 'Message text is required' }, { status: 400 });
      }
    }
    
    const client = await clientPromise;
    const db = client.db('whatsapp');
    const processor = new MessageProcessor(db);
    
    // Send message with type information
    const result = await processor.sendMessage(
      wa_id, 
      text?.trim() || '', 
      contactName,
      { type, imageData }
    );
    
    if (result.success) {
      return Response.json({ message: result.message });
    } else {
      return Response.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error('Error sending message:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

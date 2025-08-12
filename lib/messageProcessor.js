export class MessageProcessor {
  constructor(db) {
    this.db = db;
    this.collection = db.collection('processed_messages');
  }

  async processMessage(payload) {
    try {
      if (payload.entry?.[0]?.changes?.[0]?.value?.messages) {
        // Process incoming messages
        const messages = payload.entry[0].changes[0].value.messages;
        const contacts = payload.entry[0].changes[0].value.contacts || [];
        
        for (const message of messages) {
          const contact = contacts.find(c => c.wa_id === message.from);
          
          const processedMessage = {
            id: message.id,
            wa_id: message.from,
            from: message.from,
            timestamp: new Date(parseInt(message.timestamp) * 1000),
            type: message.type,
            text: message.text?.body || '',
            contact_name: contact?.profile?.name || `User ${message.from}`,
            status: 'received',
            direction: 'incoming',
            created_at: new Date(),
            updated_at: new Date()
          };

          // Handle different message types
          if (message.type === 'image' && message.image) {
            processedMessage.media = {
              type: 'image',
              mime_type: message.image.mime_type,
              caption: message.image.caption || ''
            };
          } else if (message.type === 'document' && message.document) {
            processedMessage.media = {
              type: 'document',
              mime_type: message.document.mime_type,
              filename: message.document.filename || 'Document'
            };
          }

          await this.collection.insertOne(processedMessage);
        }
      }

      if (payload.entry?.[0]?.changes?.[0]?.value?.statuses) {
        // Process status updates
        const statuses = payload.entry[0].changes[0].value.statuses;
        
        for (const status of statuses) {
          await this.collection.updateOne(
            { 
              $or: [
                { id: status.id },
                { meta_msg_id: status.id }
              ]
            },
            { 
              $set: { 
                status: status.status,
                updated_at: new Date()
              }
            }
          );
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error processing message:', error);
      return { success: false, error: error.message };
    }
  }

  async getConversations() {
    try {
      const conversations = await this.collection.aggregate([
        {
          $sort: { timestamp: -1 }
        },
        {
          $group: {
            _id: '$wa_id',
            contact_name: { $first: '$contact_name' },
            last_message: { $first: '$text' },
            last_message_time: { $first: '$timestamp' },
            unread_count: { 
              $sum: { 
                $cond: [
                  { $and: [
                    { $eq: ['$direction', 'incoming'] },
                    { $ne: ['$status', 'read'] }
                  ]},
                  1,
                  0
                ]
              }
            }
          }
        },
        {
          $sort: { last_message_time: -1 }
        }
      ]).toArray();

      return conversations;
    } catch (error) {
      console.error('Error getting conversations:', error);
      return [];
    }
  }

  async getMessages(wa_id) {
    try {
      const messages = await this.collection
        .find({ wa_id })
        .sort({ timestamp: 1 })
        .toArray();

      return messages;
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  async sendMessage(wa_id, text, contactName, messageOptions = {}) {
    try {
      const message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        wa_id,
        from: 'me',
        timestamp: new Date(),
        type: messageOptions.type || 'text',
        text,
        contact_name: contactName || `User ${wa_id}`,
        status: 'sent',
        direction: 'outgoing',
        created_at: new Date(),
        updated_at: new Date()
      };

      // Add image data if it's an image message
      if (messageOptions.type === 'image' && messageOptions.imageData) {
        message.imageData = messageOptions.imageData;
      }

      const result = await this.collection.insertOne(message);
      return { success: true, message: { ...message, _id: result.insertedId } };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteMessage(wa_id, messageId) {
    try {
      console.log('Attempting to delete message:', { wa_id, messageId });
      
      // First, let's find the message to see what we're working with - search more broadly
      const existingMessage = await this.collection.findOne({
        $or: [
          { id: messageId },
          { _id: messageId }
        ]
      });
      
      console.log('Found message (broad search):', existingMessage);
      
      if (!existingMessage) {
        // Try with ObjectId if it looks like a MongoDB ObjectId
        try {
          if (messageId.match(/^[0-9a-fA-F]{24}$/)) {
            const { ObjectId } = await import('mongodb');
            const objectIdMessage = await this.collection.findOne({
              _id: new ObjectId(messageId)
            });
            console.log('Found message with ObjectId:', objectIdMessage);
            
            if (objectIdMessage) {
              // Check if it's deletable and from the right conversation
              if (objectIdMessage.wa_id !== wa_id) {
                return { success: false, error: 'Message not found in this conversation' };
              }
              
              if (objectIdMessage.direction !== 'outgoing' && objectIdMessage.from !== 'me') {
                return { success: false, error: 'Cannot delete incoming messages' };
              }
              
              // Delete using ObjectId
              const result = await this.collection.deleteOne({ _id: new ObjectId(messageId) });
              console.log('Delete result (ObjectId):', result);
              
              if (result.deletedCount === 0) {
                return { success: false, error: 'Failed to delete message' };
              }
              
              return { success: true };
            }
          }
        } catch (objIdError) {
          console.log('ObjectId error:', objIdError);
        }
        
        console.log('Message not found with any method');
        return { success: false, error: 'Message not found' };
      }
      
      // Check if it's from the right conversation
      if (existingMessage.wa_id !== wa_id) {
        return { success: false, error: 'Message not found in this conversation' };
      }
      
      // Check if it's deletable (only outgoing messages)
      if (existingMessage.direction !== 'outgoing' && existingMessage.from !== 'me') {
        console.log('Cannot delete incoming message');
        return { success: false, error: 'Cannot delete incoming messages' };
      }
      
      // Try to delete using the same query that found it
      const result = await this.collection.deleteOne({
        $or: [
          { id: messageId },
          { _id: messageId }
        ]
      });

      console.log('Delete result:', result);

      if (result.deletedCount === 0) {
        return { success: false, error: 'Failed to delete message' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting message:', error);
      return { success: false, error: error.message };
    }
  }
}

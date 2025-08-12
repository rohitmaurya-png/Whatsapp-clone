import clientPromise from '../../../lib/mongodb';
import { MessageProcessor } from '../../../lib/messageProcessor';
import { samplePayloads } from '../../../lib/sampleData';

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db('whatsapp');
    const processor = new MessageProcessor(db);
    
    // Clear existing data
    await db.collection('processed_messages').deleteMany({});
    console.log('Cleared existing messages');
    
    // Process all sample payloads
    let processedCount = 0;
    for (const payload of samplePayloads) {
      const result = await processor.processMessage(payload);
      if (result.success) {
        processedCount++;
        console.log(`✓ Processed payload ${processedCount}/${samplePayloads.length}`);
      } else {
        console.log(`✗ Failed to process payload:`, result.error);
      }
    }
    
    const messageCount = await db.collection('processed_messages').countDocuments();
    const conversationCount = await db.collection('processed_messages').distinct('wa_id').then(ids => ids.length);
    
    return Response.json({
      success: true,
      message: 'Sample WhatsApp conversations created successfully',
      stats: {
        payloadsProcessed: processedCount,
        totalMessages: messageCount,
        totalConversations: conversationCount
      }
    });
    
  } catch (error) {
    console.error('Error creating sample data:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db('whatsapp');
    
    const messageCount = await db.collection('processed_messages').countDocuments();
    const conversationCount = await db.collection('processed_messages').distinct('wa_id').then(ids => ids.length);
    
    return Response.json({
      success: true,
      stats: {
        totalMessages: messageCount,
        totalConversations: conversationCount,
        samplePayloadsAvailable: samplePayloads.length
      }
    });
    
  } catch (error) {
    console.error('Error getting stats:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

async function createSampleData(processor) {
  console.log('Creating sample conversations...');
  
  // Sample payload 1 - Incoming message from John
  const samplePayload1 = {
    entry: [{
      changes: [{
        value: {
          messaging_product: "whatsapp",
          metadata: {
            display_phone_number: "15550199947",
            phone_number_id: "106540352242677"
          },
          contacts: [{
            profile: {
              name: "John Smith"
            },
            wa_id: "919876543210"
          }],
          messages: [{
            from: "919876543210",
            id: "wamid.HBgLMTkxOTg3NjU0MzIxMBUCABIYFjNBMDJCOUE5QzA3RjFFMTM5RTAy",
            timestamp: "1704067200",
            text: {
              body: "Hello! How are you doing today? I hope everything is going well."
            },
            type: "text"
          }]
        }
      }]
    }]
  };

  // Sample payload 2 - Another contact (Sarah)
  const samplePayload2 = {
    entry: [{
      changes: [{
        value: {
          messaging_product: "whatsapp",
          metadata: {
            display_phone_number: "15550199947",
            phone_number_id: "106540352242677"
          },
          contacts: [{
            profile: {
              name: "Sarah Johnson"
            },
            wa_id: "919876543211"
          }],
          messages: [{
            from: "919876543211",
            id: "wamid.HBgLMTkxOTg3NjU0MzIxMVUCABIYFjNBMDJCOUE5QzA3RjFFMTM5RTAz",
            timestamp: "1704067800",
            text: {
              body: "Hi there! Do you have time for a quick call this afternoon?"
            },
            type: "text"
          }]
        }
      }]
    }]
  };

  // Sample payload 3 - Third contact (Mike)
  const samplePayload3 = {
    entry: [{
      changes: [{
        value: {
          messaging_product: "whatsapp",
          metadata: {
            display_phone_number: "15550199947",
            phone_number_id: "106540352242677"
          },
          contacts: [{
            profile: {
              name: "Mike Wilson"
            },
            wa_id: "919876543212"
          }],
          messages: [{
            from: "919876543212",
            id: "wamid.HBgLMTkxOTg3NjU0MzIxMlUCABIYFjNBMDJCOUE5QzA3RjFFMTM5RTAz",
            timestamp: "1704068400",
            text: {
              body: "Hey! The meeting has been moved to 4 PM tomorrow. Are you available?"
            },
            type: "text"
          }]
        }
      }]
    }]
  };

  // More messages for John
  const samplePayload4 = {
    entry: [{
      changes: [{
        value: {
          messaging_product: "whatsapp",
          metadata: {
            display_phone_number: "15550199947",
            phone_number_id: "106540352242677"
          },
          contacts: [{
            profile: {
              name: "John Smith"
            },
            wa_id: "919876543210"
          }],
          messages: [{
            from: "919876543210",
            id: "wamid.HBgLMTkxOTg3NjU0MzIxMBUCABIYFjNBMDJCOUE5QzA3RjFFMTM5RTAy4",
            timestamp: "1704070800",
            text: {
              body: "Are we still meeting today at 3 PM? Let me know if the time works for you."
            },
            type: "text"
          }]
        }
      }]
    }]
  };

  // More messages for Sarah
  const samplePayload5 = {
    entry: [{
      changes: [{
        value: {
          messaging_product: "whatsapp",
          metadata: {
            display_phone_number: "15550199947",
            phone_number_id: "106540352242677"
          },
          contacts: [{
            profile: {
              name: "Sarah Johnson"
            },
            wa_id: "919876543211"
          }],
          messages: [{
            from: "919876543211",
            id: "wamid.HBgLMTkxOTg3NjU0MzIxMVUCABIYFjNBMDJCOUE5QzA3RjFFMTM5RTAz5",
            timestamp: "1704071400",
            text: {
              body: "Thanks for the quick response! I'll call you in about 5 minutes."
            },
            type: "text"
          }]
        }
      }]
    }]
  };

  // Recent message from Mike
  const samplePayload6 = {
    entry: [{
      changes: [{
        value: {
          messaging_product: "whatsapp",
          metadata: {
            display_phone_number: "15550199947",
            phone_number_id: "106540352242677"
          },
          contacts: [{
            profile: {
              name: "Mike Wilson"
            },
            wa_id: "919876543212"
          }],
          messages: [{
            from: "919876543212",
            id: "wamid.HBgLMTkxOTg3NjU0MzIxMlUCABIYFjNBMDJCOUE5QzA3RjFFMTM5RTAz6",
            timestamp: "1704072000",
            text: {
              body: "Perfect! See you tomorrow at 4 PM. Don't forget to bring the project files."
            },
            type: "text"
          }]
        }
      }]
    }]
  };

  // Status update example
  const statusPayload = {
    entry: [{
      changes: [{
        value: {
          messaging_product: "whatsapp",
          metadata: {
            display_phone_number: "15550199947",
            phone_number_id: "106540352242677"
          },
          statuses: [{
            id: "wamid.HBgLMTkxOTg3NjU0MzIxMBUCABIYFjNBMDJCOUE5QzA3RjFFMTM5RTAy",
            status: "delivered",
            timestamp: "1704067300",
            recipient_id: "919876543210"
          }]
        }
      }]
    }]
  };

  const payloads = [
    samplePayload1, 
    samplePayload2, 
    samplePayload3, 
    samplePayload4, 
    samplePayload5, 
    samplePayload6,
    statusPayload
  ];
  
  for (let i = 0; i < payloads.length; i++) {
    const result = await processor.processMessage(payloads[i]);
    if (result.success) {
      console.log(`✓ Sample payload ${i + 1} processed successfully`);
    } else {
      console.log(`✗ Failed to process sample payload ${i + 1}:`, result.error);
    }
  }
}

import { MongoClient } from 'mongodb';
import { MessageProcessor } from '../lib/messageProcessor.js';
import fs from 'fs';
import path from 'path';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';

async function processPayloadFiles() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('whatsapp');
    const processor = new MessageProcessor(db);
    
    // Clear existing data
    await db.collection('processed_messages').deleteMany({});
    console.log('Cleared existing messages');
    
    const dataDir = path.join(process.cwd(), 'data');
    
    if (!fs.existsSync(dataDir)) {
      console.log('Creating sample data...');
      await createSampleData(processor);
      return;
    }
    
    const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
    
    console.log(`Found ${files.length} payload files`);
    
    for (const file of files) {
      console.log(`Processing ${file}...`);
      
      const filePath = path.join(dataDir, file);
      const payload = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      const result = await processor.processMessage(payload);
      
      if (result.success) {
        console.log(`✓ Processed ${file} successfully`);
      } else {
        console.log(`✗ Failed to process ${file}:`, result.error);
      }
    }
    
    console.log('All payload files processed!');
    
    // Display summary
    const messageCount = await db.collection('processed_messages').countDocuments();
    const conversationCount = await db.collection('processed_messages').distinct('wa_id').then(ids => ids.length);
    
    console.log(`\nSummary:`);
    console.log(`- Total messages: ${messageCount}`);
    console.log(`- Total conversations: ${conversationCount}`);
    
  } catch (error) {
    console.error('Error processing payloads:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

async function createSampleData(processor) {
  console.log('Creating sample conversations...');
  
  // Sample payload 1 - Incoming message
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
              body: "Hello! How are you doing?"
            },
            type: "text"
          }]
        }
      }]
    }]
  };

  // Sample payload 2 - Another contact
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
              body: "Hi there! Do you have time for a quick call?"
            },
            type: "text"
          }]
        }
      }]
    }]
  };

  // Sample payload 3 - Status update
  const samplePayload3 = {
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

  // More sample messages for John
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
              body: "Are we still meeting today at 3 PM?"
            },
            type: "text"
          }]
        }
      }]
    }]
  };

  // More sample messages for Sarah
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
              body: "Thanks for the quick response! I'll call you in 5 minutes."
            },
            type: "text"
          }]
        }
      }]
    }]
  };

  const payloads = [samplePayload1, samplePayload2, samplePayload3, samplePayload4, samplePayload5];
  
  for (let i = 0; i < payloads.length; i++) {
    const result = await processor.processMessage(payloads[i]);
    if (result.success) {
      console.log(`✓ Sample payload ${i + 1} processed successfully`);
    } else {
      console.log(`✗ Failed to process sample payload ${i + 1}:`, result.error);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  processPayloadFiles();
}

export { processPayloadFiles };

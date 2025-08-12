import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample webhook payloads that simulate real WhatsApp Business API data
export const samplePayloads = [
  // Incoming message from John Smith
  {
    "object": "whatsapp_business_account",
    "entry": [
      {
        "id": "106540352242677",
        "changes": [
          {
            "value": {
              "messaging_product": "whatsapp",
              "metadata": {
                "display_phone_number": "15550199947",
                "phone_number_id": "106540352242677"
              },
              "contacts": [
                {
                  "profile": {
                    "name": "John Smith"
                  },
                  "wa_id": "919876543210"
                }
              ],
              "messages": [
                {
                  "from": "919876543210",
                  "id": "wamid.HBgLMTkxOTg3NjU0MzIxMBUCABIYFjNBMDJCOUE5QzA3RjFFMTM5RTAy",
                  "timestamp": "1704067200",
                  "text": {
                    "body": "Hello! How are you doing today? I hope everything is going well with your projects."
                  },
                  "type": "text"
                }
              ]
            },
            "field": "messages"
          }
        ]
      }
    ]
  },

  // Incoming message from Sarah Johnson
  {
    "object": "whatsapp_business_account",
    "entry": [
      {
        "id": "106540352242677",
        "changes": [
          {
            "value": {
              "messaging_product": "whatsapp",
              "metadata": {
                "display_phone_number": "15550199947",
                "phone_number_id": "106540352242677"
              },
              "contacts": [
                {
                  "profile": {
                    "name": "Sarah Johnson"
                  },
                  "wa_id": "919876543211"
                }
              ],
              "messages": [
                {
                  "from": "919876543211",
                  "id": "wamid.HBgLMTkxOTg3NjU0MzIxMVUCABIYFjNBMDJCOUE5QzA3RjFFMTM5RTAz",
                  "timestamp": "1704067800",
                  "text": {
                    "body": "Hi there! Do you have time for a quick call this afternoon? I wanted to discuss the upcoming project."
                  },
                  "type": "text"
                }
              ]
            },
            "field": "messages"
          }
        ]
      }
    ]
  },

  // Incoming message from Mike Wilson
  {
    "object": "whatsapp_business_account",
    "entry": [
      {
        "id": "106540352242677",
        "changes": [
          {
            "value": {
              "messaging_product": "whatsapp",
              "metadata": {
                "display_phone_number": "15550199947",
                "phone_number_id": "106540352242677"
              },
              "contacts": [
                {
                  "profile": {
                    "name": "Mike Wilson"
                  },
                  "wa_id": "919876543212"
                }
              ],
              "messages": [
                {
                  "from": "919876543212",
                  "id": "wamid.HBgLMTkxOTg3NjU0MzIxMlUCABIYFjNBMDJCOUE5QzA3RjFFMTM5RTAz",
                  "timestamp": "1704068400",
                  "text": {
                    "body": "Hey! The meeting has been moved to 4 PM tomorrow. Are you available? Please confirm."
                  },
                  "type": "text"
                }
              ]
            },
            "field": "messages"
          }
        ]
      }
    ]
  },

  // Status update (delivered)
  {
    "object": "whatsapp_business_account",
    "entry": [
      {
        "id": "106540352242677",
        "changes": [
          {
            "value": {
              "messaging_product": "whatsapp",
              "metadata": {
                "display_phone_number": "15550199947",
                "phone_number_id": "106540352242677"
              },
              "statuses": [
                {
                  "id": "wamid.HBgLMTkxOTg3NjU0MzIxMBUCABIYFjNBMDJCOUE5QzA3RjFFMTM5RTAy",
                  "status": "delivered",
                  "timestamp": "1704067300",
                  "recipient_id": "919876543210",
                  "conversation": {
                    "id": "d5b3a4f2c1e6789012345678",
                    "expiration_timestamp": "1704153600",
                    "origin": {
                      "type": "user_initiated"
                    }
                  },
                  "pricing": {
                    "billable": true,
                    "pricing_model": "CBP",
                    "category": "user_initiated"
                  }
                }
              ]
            },
            "field": "messages"
          }
        ]
      }
    ]
  },

  // More messages for conversation depth
  {
    "object": "whatsapp_business_account",
    "entry": [
      {
        "id": "106540352242677",
        "changes": [
          {
            "value": {
              "messaging_product": "whatsapp",
              "metadata": {
                "display_phone_number": "15550199947",
                "phone_number_id": "106540352242677"
              },
              "contacts": [
                {
                  "profile": {
                    "name": "John Smith"
                  },
                  "wa_id": "919876543210"
                }
              ],
              "messages": [
                {
                  "from": "919876543210",
                  "id": "wamid.HBgLMTkxOTg3NjU0MzIxMBUCABIYFjNBMDJCOUE5QzA3RjFFMTM5RTAy4",
                  "timestamp": "1704070800",
                  "text": {
                    "body": "Are we still meeting today at 3 PM? Let me know if the time works for you. I have the documents ready."
                  },
                  "type": "text"
                }
              ]
            },
            "field": "messages"
          }
        ]
      }
    ]
  },

  // Image message example
  {
    "object": "whatsapp_business_account",
    "entry": [
      {
        "id": "106540352242677",
        "changes": [
          {
            "value": {
              "messaging_product": "whatsapp",
              "metadata": {
                "display_phone_number": "15550199947",
                "phone_number_id": "106540352242677"
              },
              "contacts": [
                {
                  "profile": {
                    "name": "Sarah Johnson"
                  },
                  "wa_id": "919876543211"
                }
              ],
              "messages": [
                {
                  "from": "919876543211",
                  "id": "wamid.HBgLMTkxOTg3NjU0MzIxMVUCABIYFjNBMDJCOUE5QzA3RjFFMTM5RTAz5",
                  "timestamp": "1704071400",
                  "type": "image",
                  "image": {
                    "caption": "Here's the design mockup we discussed",
                    "mime_type": "image/jpeg",
                    "sha256": "abc123def456ghi789",
                    "id": "4a9b8c3d2e1f"
                  }
                }
              ]
            },
            "field": "messages"
          }
        ]
      }
    ]
  },

  // Read status update
  {
    "object": "whatsapp_business_account",
    "entry": [
      {
        "id": "106540352242677",
        "changes": [
          {
            "value": {
              "messaging_product": "whatsapp",
              "metadata": {
                "display_phone_number": "15550199947",
                "phone_number_id": "106540352242677"
              },
              "statuses": [
                {
                  "id": "wamid.HBgLMTkxOTg3NjU0MzIxMVUCABIYFjNBMDJCOUE5QzA3RjFFMTM5RTAz",
                  "status": "read",
                  "timestamp": "1704071500",
                  "recipient_id": "919876543211"
                }
              ]
            },
            "field": "messages"
          }
        ]
      }
    ]
  },

  // Recent message from Mike
  {
    "object": "whatsapp_business_account",
    "entry": [
      {
        "id": "106540352242677",
        "changes": [
          {
            "value": {
              "messaging_product": "whatsapp",
              "metadata": {
                "display_phone_number": "15550199947",
                "phone_number_id": "106540352242677"
              },
              "contacts": [
                {
                  "profile": {
                    "name": "Mike Wilson"
                  },
                  "wa_id": "919876543212"
                }
              ],
              "messages": [
                {
                  "from": "919876543212",
                  "id": "wamid.HBgLMTkxOTg3NjU0MzIxMlUCABIYFjNBMDJCOUE5QzA3RjFFMTM5RTAz6",
                  "timestamp": "1704072000",
                  "text": {
                    "body": "Perfect! See you tomorrow at 4 PM. Don't forget to bring the project files and the latest updates."
                  },
                  "type": "text"
                }
              ]
            },
            "field": "messages"
          }
        ]
      }
    ]
  }
];

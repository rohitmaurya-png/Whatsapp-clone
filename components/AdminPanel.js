'use client';

import { useState } from 'react';

export default function AdminPanel({ onInitDemo }) {
  const [isInitializing, setIsInitializing] = useState(false);
  const [message, setMessage] = useState('');

  const handleInitDemo = async () => {
    setIsInitializing(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/init-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ Success! Created ${data.stats.totalMessages} messages across ${data.stats.totalConversations} conversations`);
        if (onInitDemo) {
          onInitDemo();
        }
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleProcessWebhook = async () => {
    setMessage('🔄 Processing webhook...');
    
    try {
      const sampleWebhook = {
        "object": "whatsapp_business_account",
        "entry": [{
          "id": "106540352242677",
          "changes": [{
            "value": {
              "messaging_product": "whatsapp",
              "metadata": {
                "display_phone_number": "15550199947",
                "phone_number_id": "106540352242677"
              },
              "contacts": [{
                "profile": { "name": "Demo User" },
                "wa_id": "919999999999"
              }],
              "messages": [{
                "from": "919999999999",
                "id": `wamid.demo_${Date.now()}`,
                "timestamp": Math.floor(Date.now() / 1000).toString(),
                "text": { "body": "Hello from webhook demo!" },
                "type": "text"
              }]
            },
            "field": "messages"
          }]
        }]
      };

      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sampleWebhook),
      });

      if (response.ok) {
        setMessage('✅ Webhook processed successfully!');
        if (onInitDemo) {
          onInitDemo();
        }
      } else {
        setMessage('❌ Webhook processing failed');
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="bg-white border-l border-gray-200 p-4 w-80 flex flex-col">
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          🚀 WhatsApp Web Clone Demo
        </h2>
        <p className="text-sm text-gray-600">
          Full-stack implementation with MongoDB, WebSocket, and real-time messaging
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-green-50 p-3 rounded-lg">
          <h3 className="font-medium text-green-800 mb-2">✅ Features Implemented</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Webhook payload processing</li>
            <li>• Real-time messaging</li>
            <li>• MongoDB integration</li>
            <li>• Status indicators</li>
            <li>• Responsive design</li>
            <li>• Socket.IO real-time updates</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleInitDemo}
            disabled={isInitializing}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isInitializing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Initializing...
              </>
            ) : (
              '🗃️ Initialize Demo Data'
            )}
          </button>

          <button
            onClick={handleProcessWebhook}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 flex items-center justify-center"
          >
            🔗 Test Webhook Processing
          </button>
        </div>

        {message && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{message}</p>
          </div>
        )}

        <div className="bg-blue-50 p-3 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">📋 API Endpoints</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li><code>POST /api/webhook</code> - Process WhatsApp webhooks</li>
            <li><code>GET /api/conversations</code> - Get all conversations</li>
            <li><code>GET /api/messages/[wa_id]</code> - Get messages</li>
            <li><code>POST /api/messages/[wa_id]</code> - Send message</li>
            <li><code>POST /api/init-demo</code> - Initialize demo data</li>
          </ul>
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg">
          <h3 className="font-medium text-yellow-800 mb-2">🛠️ Tech Stack</h3>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• Next.js 15 (App Router)</li>
            <li>• React 19</li>
            <li>• MongoDB Atlas</li>
            <li>• Socket.IO</li>
            <li>• Tailwind CSS</li>
            <li>• Vercel Ready</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-3 rounded-lg">
          <h3 className="font-medium text-purple-800 mb-2">🚀 Deployment</h3>
          <p className="text-xs text-purple-700">
            Ready for Vercel, Heroku, or any hosting platform. 
            Environment variables configured for production.
          </p>
        </div>
      </div>
    </div>
  );
}

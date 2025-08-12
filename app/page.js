'use client';

import { useState, useEffect } from 'react';
import ConversationList from '../components/ConversationList';
import ChatArea from '../components/ChatArea';
import AdminPanel from '../components/AdminPanel';
import { useSocket } from '../context/SocketContext';
import { useSocketInit } from '../hooks/useSocketInit';

export default function Home() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false); // Hide admin panel by default
  
  const { socket, isConnected, joinConversation, leaveConversation, sendMessage } = useSocket();
  
  // Initialize Socket.IO server
  useSocketInit();

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Handle real-time message updates
  useEffect(() => {
    if (socket) {
      socket.on('message-received', (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
        
        // Update conversation list with new message
        setConversations(prev => 
          prev.map(conv => 
            conv._id === newMessage.wa_id
              ? {
                  ...conv,
                  last_message: newMessage.text,
                  last_message_time: new Date(newMessage.timestamp),
                }
              : conv
          )
        );
      });

      return () => {
        socket.off('message-received');
      };
    }
  }, [socket]);

  // Join/leave conversation rooms when selection changes
  useEffect(() => {
    if (selectedConversation && socket) {
      joinConversation(selectedConversation._id);
      
      return () => {
        leaveConversation(selectedConversation._id);
      };
    }
  }, [selectedConversation, socket, joinConversation, leaveConversation]);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations');
      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (wa_id) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/messages/${wa_id}`);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = async (text, messageData = null) => {
    if (!selectedConversation || (!text.trim() && !messageData)) return;

    try {
      const messagePayload = {
        contactName: selectedConversation.contact_name,
      };

      // Handle different message types
      if (messageData && messageData.type === 'image') {
        messagePayload.type = 'image';
        messagePayload.imageData = messageData.data;
        messagePayload.text = text || '';
      } else {
        messagePayload.text = text.trim();
        messagePayload.type = 'text';
      }

      const response = await fetch(`/api/messages/${selectedConversation._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messagePayload),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add message to local state immediately
        setMessages(prev => [...prev, data.message]);
        
        // Emit real-time update to other clients
        if (socket) {
          sendMessage({
            ...data.message,
            wa_id: selectedConversation._id
          });
        }
        
        // Update the conversation list
        const displayText = messageData?.type === 'image' 
          ? '📷 Image' 
          : (text?.trim() || messagePayload.text);
          
        setConversations(prev => 
          prev.map(conv => 
            conv._id === selectedConversation._id
              ? {
                  ...conv,
                  last_message: displayText,
                  last_message_time: new Date(),
                }
              : conv
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const handleInitDemo = () => {
    fetchConversations();
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    // Refresh the messages to reflect the deletion
    if (selectedConversation) {
      await fetchMessages(selectedConversation._id);
      // Also refresh conversations to update last message
      await fetchConversations();
    }
  };

  return (
    <div className="h-screen flex bg-[#111b21] overflow-hidden relative">
      {/* Demo Info Banner */}
      <div className="absolute top-0 left-0 right-0 bg-green-500 text-white px-2 sm:px-4 py-2 text-center text-xs sm:text-sm z-50 flex flex-col sm:flex-row items-center justify-center">
        <span className="hidden sm:inline">🚀 WhatsApp Web Clone - Full Stack Demo with MongoDB, WebSocket & Real-time Messaging</span>
        <span className="sm:hidden">🚀 WhatsApp Clone Demo</span>
        {isConnected && <span className="ml-0 sm:ml-2 text-green-200">● Connected</span>}
        {!isConnected && <span className="ml-0 sm:ml-2 text-red-200">● Disconnected</span>}
      </div>

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto bg-white shadow-2xl flex mt-8 sm:mt-10 relative">
        {/* Mobile: Show either conversation list or chat area */}
        <div className="flex w-full relative">
          {/* Conversation List */}
          <div className={`${
            selectedConversation ? 'hidden md:block' : 'block'
          } w-full md:w-1/3 relative z-20`}>
            <ConversationList
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelectConversation={handleSelectConversation}
            />
          </div>
          
          {/* Chat Area */}
          <div className={`${
            !selectedConversation ? 'hidden md:block' : 'block'
          } w-full md:w-2/3 relative z-10`}>
            {selectedConversation ? (
              <ChatArea
                selectedConversation={selectedConversation}
                messages={messages}
                onSendMessage={handleSendMessage}
                onDeleteMessage={handleDeleteMessage}
                onBackToConversations={() => setSelectedConversation(null)}
                loading={loading}
              />
            ) : (
              <div className="hidden md:flex h-full bg-[#f0f2f5] items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-64 h-64 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-2xl">
                    <svg className="w-32 h-32 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">WhatsApp Web</h2>
                  <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
                    Select a conversation to start messaging or create a new conversation
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Admin Panel */}
        {showAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 md:relative md:bg-transparent md:inset-auto md:w-80">
            <AdminPanel onInitDemo={handleInitDemo} />
          </div>
        )}
      </div>
    </div>
  );
}

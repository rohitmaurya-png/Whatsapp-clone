'use client';

import { useState, useEffect, useRef } from 'react';
import { formatMessageTime, getInitials } from '../lib/utils';
import EmojiPicker from './EmojiPicker';
import ImagePicker from './ImagePicker';

export default function ChatArea({ 
  selectedConversation, 
  messages, 
  onSendMessage,
  onDeleteMessage,
  onBackToConversations,
  loading 
}) {
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.emoji-picker-container') && 
          !event.target.closest('.emoji-button')) {
        setShowEmojiPicker(false);
      }
      if (!event.target.closest('.image-picker-container') && 
          !event.target.closest('.image-button')) {
        setShowImagePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await onSendMessage(newMessage.trim());
      setNewMessage('');
      setShowEmojiPicker(false);
      setShowImagePicker(false);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleEmojiSelect = (emoji) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = newMessage.slice(0, start) + emoji + newMessage.slice(end);
      setNewMessage(newText);
      
      // Focus back to textarea and set cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    } else {
      setNewMessage(prev => prev + emoji);
    }
  };

  const handleImageSelect = async (imageData) => {
    try {
      setSending(true);
      // Send the image data directly as a special message type
      await onSendMessage('', { type: 'image', data: imageData });
    } catch (error) {
      console.error('Error sending image:', error);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const wa_id = selectedConversation?._id || selectedConversation?.wa_id;
      
      console.log('Attempting to delete message:', { 
        messageId, 
        wa_id: wa_id,
        selectedConversation: selectedConversation
      });
      
      if (!selectedConversation || !wa_id) {
        throw new Error('No conversation selected or wa_id missing');
      }
      
      const response = await fetch(`/api/messages/${wa_id}/${messageId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      console.log('Delete response:', { status: response.status, result });

      if (!response.ok) {
        throw new Error(result.error || `Failed to delete message: ${response.status}`);
      }

      // Call the parent callback to refresh messages
      if (onDeleteMessage) {
        await onDeleteMessage(messageId);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert(`Failed to delete message: ${error.message}`);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return (
          <svg className="w-4 h-4 text-gray-400 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'delivered':
        return (
          <div className="flex -space-x-1">
            <svg className="w-4 h-4 text-gray-500 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <svg className="w-4 h-4 text-gray-500 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'read':
        return (
          <div className="flex -space-x-1">
            <svg className="w-4 h-4 text-blue-500 drop-shadow-sm animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <svg className="w-4 h-4 text-blue-500 drop-shadow-sm animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  if (!selectedConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#f8f9fa] via-[#f0f2f5] to-[#e8f5e8] relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-gradient-to-br from-[#00a884]/5 to-transparent animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-[#128c7e]/5 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-br from-[#00b894]/3 to-transparent animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="text-center max-w-xl mx-auto px-8 relative z-10">
          <div className="w-80 h-80 mx-auto mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-transparent backdrop-blur-xl rounded-3xl shadow-2xl ring-1 ring-white/20"></div>
            <div className="absolute inset-4 bg-gradient-to-br from-[#00a884]/10 via-[#00b894]/5 to-[#128c7e]/10 rounded-2xl flex items-center justify-center">
              <svg viewBox="0 0 340 220" className="w-64 h-40 opacity-30">
                <defs>
                  <linearGradient id="modernGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00a884" />
                    <stop offset="50%" stopColor="#00b894" />
                    <stop offset="100%" stopColor="#128c7e" />
                  </linearGradient>
                </defs>
                <rect x="50" y="30" width="240" height="160" rx="24" fill="url(#modernGradient)" opacity="0.6"/>
                <circle cx="120" cy="100" r="25" fill="white" opacity="0.8"/>
                <circle cx="220" cy="100" r="25" fill="white" opacity="0.8"/>
                <path d="M100 130 Q170 110 240 130" stroke="white" strokeWidth="6" fill="none" opacity="0.6"/>
              </svg>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-[#00a884] via-[#00b894] to-[#128c7e] bg-clip-text text-transparent mb-4 tracking-tight">
                WhatsApp Web
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#00a884] to-[#128c7e] rounded-full mx-auto"></div>
            </div>
            
            <p className="text-gray-600 text-xl leading-relaxed max-w-2xl mx-auto font-medium">
              Send and receive messages without keeping your phone online.<br/>
              <span className="text-gray-500 text-lg">Use WhatsApp on up to 4 linked devices and 1 phone at the same time.</span>
            </p>
            
            <div className="mt-12 p-8 bg-white/60 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 via-transparent to-green-50/50"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-xl ring-4 ring-yellow-100">
                    <span className="text-2xl">💡</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Ready to start?</h3>
                <p className="text-gray-700 font-medium text-lg">
                  Select a conversation from the left to begin chatting
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#efeae2] relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Chat Header */}
      <div className="bg-gradient-to-r from-white via-[#f8f9fa] to-white p-3 sm:p-5 border-b border-gray-200/80 flex items-center relative z-10 shadow-lg backdrop-blur-xl">
        {/* Mobile Back Button */}
        {onBackToConversations && (
          <button
            onClick={onBackToConversations}
            className="md:hidden p-2 mr-3 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        <div className="relative group">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-[#00a884] via-[#00b894] to-[#128c7e] rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-5 shadow-xl ring-2 sm:ring-4 ring-white/50 relative overflow-hidden transition-all duration-300 group-hover:scale-110">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/10"></div>
            <span className="text-white font-bold text-sm sm:text-xl relative z-10">
              {getInitials(selectedConversation.contact_name)}
            </span>
          </div>
          <div className="absolute -bottom-0.5 -right-2 sm:-bottom-1 sm:-right-3 w-4 h-4 sm:w-6 sm:h-6 bg-green-400 border-2 sm:border-3 border-white rounded-full shadow-lg animate-pulse"></div>
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-gray-900 text-lg sm:text-xl leading-tight tracking-tight">
            {selectedConversation.contact_name}
          </h2>
          <div className="flex items-center mt-1 space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-xs sm:text-sm text-green-600 font-semibold">
              online • last seen recently
            </p>
          </div>
        </div>
        <div className="flex space-x-1 sm:space-x-3">
          <button className="p-2 sm:p-3 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-110 group border border-gray-100/50">
            <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600 group-hover:text-[#00a884]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-1.513-.421-2.928-1.157-4.243a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="p-2 sm:p-3 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-110 group border border-gray-100/50">
            <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600 group-hover:text-[#00a884]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          </button>
          <button className="p-2 sm:p-3 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-110 group border border-gray-100/50">
            <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600 group-hover:text-[#00a884]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-2 sm:space-y-3 relative z-10">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-[#00a884]"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-600 mt-12 sm:mt-20">
            <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-white to-gray-50 rounded-full flex items-center justify-center shadow-xl ring-2 sm:ring-4 ring-green-100">
              <svg className="w-8 h-8 sm:w-12 sm:h-12 text-[#00a884]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3">No messages yet</p>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xs sm:max-w-sm mx-auto leading-relaxed">Start a conversation by sending a message below</p>
            <div className="mt-6 sm:mt-8 animate-bounce">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-[#00a884]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOutgoing = message.direction === 'outgoing' || message.from === 'me';
            const showDate = index === 0 || 
              new Date(messages[index - 1].timestamp).toDateString() !== new Date(message.timestamp).toDateString();

            return (
              <div key={message.id || message._id}>
                {showDate && (
                  <div className="text-center mb-8 relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-gradient-to-r from-[#00a884]/10 to-[#128c7e]/10 backdrop-blur-sm px-6 py-2 rounded-full text-sm text-gray-700 shadow-lg border border-green-200 font-medium">
                        {new Date(message.timestamp).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} mb-3 sm:mb-4 group`}>
                  <div className="relative">
                    {/* Delete button - only show on hover for outgoing messages */}
                    {isOutgoing && (
                      <button
                        onClick={() => handleDeleteMessage(message.id || message._id)}
                        className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 w-6 h-6 sm:w-8 sm:h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg z-10"
                        title="Delete message"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                    
                    <div
                      className={`max-w-[85vw] sm:max-w-xs lg:max-w-md px-3 py-3 sm:px-5 sm:py-4 rounded-2xl sm:rounded-3xl shadow-xl relative transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                        isOutgoing
                          ? 'bg-gradient-to-br from-[#dcf8c6] via-[#e8fce8] to-[#d4f4cc] text-gray-900 border border-green-100 shadow-green-100/50'
                          : 'bg-white/90 backdrop-blur-xl text-gray-900 border border-gray-100/50 shadow-gray-200/50'
                      } ${
                        isOutgoing ? 'rounded-br-lg' : 'rounded-bl-lg'
                      }`}
                    >
                    {/* Enhanced message tail */}
                    <div
                      className={`absolute ${
                        isOutgoing
                          ? 'right-0 bottom-0 w-0 h-0 border-l-[12px] border-l-[#dcf8c6] border-b-[12px] border-b-transparent transform translate-x-1 translate-y-1'
                          : 'left-0 bottom-0 w-0 h-0 border-r-[12px] border-r-white border-b-[12px] border-b-transparent transform -translate-x-1 translate-y-1'
                      }`}
                    ></div>
                    
                    {/* Message Content */}
                    {message.type === 'image' ? (
                      <div className="space-y-3">
                        <div className="relative group">
                          <img
                            src={message.imageData || message.data}
                            alt="Shared image"
                            className="w-full max-w-sm h-auto rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300"
                            style={{ maxHeight: '300px', objectFit: 'cover' }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors">
                              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        {message.text && (
                          <p className="text-base leading-relaxed break-words font-medium">{message.text}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-base leading-relaxed break-words font-medium">{message.text}</p>
                    )}
                    
                    <div className={`flex items-center justify-end mt-3 space-x-2 ${
                      isOutgoing ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      <span className="text-xs font-semibold bg-black/5 px-2 py-1 rounded-full">
                        {formatMessageTime(message.timestamp)}
                      </span>
                      {isOutgoing && (
                        <div className="ml-1 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                          {getStatusIcon(message.status)}
                        </div>
                      )}
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-gradient-to-r from-white via-[#f8f9fa] to-white p-3 sm:p-6 border-t border-gray-200/80 relative z-10 backdrop-blur-xl">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2 sm:space-x-4 relative">
          <button 
            type="button" 
            onClick={() => {
              setShowImagePicker(!showImagePicker);
              setShowEmojiPicker(false);
            }}
            className="image-button p-2 sm:p-4 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-110 group border border-gray-100/50"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-[#00a884]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div className="flex-1 relative">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border-2 border-gray-200/50 focus-within:border-[#00a884]/40 transition-all duration-300 shadow-lg focus-within:shadow-2xl focus-within:ring-4 focus-within:ring-[#00a884]/10 overflow-hidden">
              <textarea
                ref={textareaRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Type your message..."
                className="w-full px-4 py-3 pr-12 sm:px-6 sm:py-4 sm:pr-16 rounded-2xl sm:rounded-3xl border-none focus:outline-none resize-none max-h-32 text-gray-900 placeholder-gray-500 text-sm sm:text-base leading-relaxed bg-transparent font-medium"
                rows="1"
                disabled={sending}
                style={{ minHeight: '48px' }}
              />
              <button 
                type="button"
                onClick={() => {
                  setShowEmojiPicker(!showEmojiPicker);
                  setShowImagePicker(false);
                }}
                className="emoji-button absolute right-3 bottom-3 sm:right-4 sm:bottom-4 p-1.5 sm:p-2 hover:bg-gray-100/80 rounded-full transition-all duration-300 hover:scale-110 group"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-[#00a884]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zM14 9a1 1 0 100-2 1 1 0 000 2zM13.536 14.464A1 1 0 0115 13c0-1.657-1.343-3-3-3s-3 1.343-3 3a1 1 0 001.464 1.464z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-2xl transform ${
              !newMessage.trim() || sending
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed scale-95 shadow-none'
                : 'bg-gradient-to-br from-[#00a884] via-[#00b894] to-[#128c7e] text-white hover:scale-110 hover:shadow-2xl hover:shadow-green-500/25 active:scale-105'
            }`}
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent"></div>
            ) : (
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            )}
          </button>

          {/* Emoji Picker */}
          <div className="emoji-picker-container">
            <EmojiPicker
              isOpen={showEmojiPicker}
              onEmojiSelect={handleEmojiSelect}
              onClose={() => setShowEmojiPicker(false)}
            />
          </div>

          {/* Image Picker */}
          <div className="image-picker-container">
            <ImagePicker
              isOpen={showImagePicker}
              onImageSelect={handleImageSelect}
              onClose={() => setShowImagePicker(false)}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

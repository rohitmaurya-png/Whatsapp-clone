'use client';

import { formatMessageTime, getInitials } from '../lib/utils';

export default function ConversationList({ 
  conversations, 
  selectedConversation, 
  onSelectConversation 
}) {
  return (
    <div className="w-full h-screen bg-white/95 backdrop-blur-xl border-r border-gray-200/50 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#00a884] via-[#00b894] to-[#128c7e] p-3 sm:p-5 shadow-xl relative overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-white/20 -translate-y-10 translate-x-10 sm:-translate-y-16 sm:translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 translate-y-6 -translate-x-6 sm:translate-y-8 sm:-translate-x-8"></div>
        </div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl ring-2 sm:ring-4 ring-white/30 backdrop-blur-sm">
                <span className="font-black text-sm sm:text-lg bg-gradient-to-br from-[#00a884] to-[#128c7e] bg-clip-text text-transparent">WA</span>
              </div>
              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">WhatsApp</h1>
              <p className="text-white/80 text-xs font-medium">Web</p>
            </div>
          </div>
          <div className="flex space-x-1 sm:space-x-2">
            <button className="p-2 sm:p-3 hover:bg-white/10 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-110 hover:rotate-3 group">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/90 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 sm:p-3 hover:bg-white/10 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-110 hover:rotate-3 group">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/90 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 sm:p-4 bg-gradient-to-br from-[#f8f9fa] to-[#f0f2f5] border-b border-gray-100/80">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#00a884]/20 focus:bg-white border-2 border-transparent focus:border-[#00a884]/30 text-gray-900 placeholder-gray-500 text-sm shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-white group-hover:scale-[1.02]"
          />
          <div className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-[#00a884] to-[#128c7e] rounded-lg sm:rounded-xl shadow-md">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-gray-50/50">
        {conversations.length === 0 ? (
          <div className="p-8 sm:p-16 text-center">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6 sm:mb-8">
              <div className="w-full h-full bg-gradient-to-br from-gray-100 via-white to-gray-200 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl ring-4 sm:ring-8 ring-gray-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent animate-pulse"></div>
                <svg className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#00a884] to-[#128c7e] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-white font-bold text-lg sm:text-xl">+</span>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 tracking-tight">No conversations yet</h3>
            <p className="text-gray-500 leading-relaxed max-w-sm mx-auto text-sm sm:text-base">Start meaningful conversations that matter</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation._id}
              onClick={() => onSelectConversation(conversation)}
              className={`mx-2 mb-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl group ${
                selectedConversation?._id === conversation._id 
                  ? 'bg-gradient-to-r from-[#e8f5e8] via-[#f0f8f0] to-[#e8f5e8] border-2 border-[#00a884]/30 shadow-2xl scale-[1.02]' 
                  : 'bg-white/70 backdrop-blur-sm hover:bg-white/90 border border-gray-100/50 hover:border-[#00a884]/20'
              }`}
            >
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="relative group-hover:scale-110 transition-transform duration-300">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#00a884] via-[#00b894] to-[#128c7e] rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ring-2 sm:ring-4 ${selectedConversation?._id === conversation._id ? 'ring-[#00a884]/20' : 'ring-white/50'} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10"></div>
                    <span className="text-white font-bold text-sm sm:text-xl relative z-10">
                      {getInitials(conversation.contact_name)}
                    </span>
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 sm:border-3 border-white shadow-lg transition-all duration-300 ${
                    selectedConversation?._id === conversation._id ? 'bg-green-400 animate-pulse' : 'bg-green-500'
                  }`}></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1 sm:mb-2">
                    <h3 className={`font-bold truncate text-base sm:text-lg leading-tight transition-colors duration-300 ${
                      selectedConversation?._id === conversation._id ? 'text-[#00a884]' : 'text-gray-900 group-hover:text-[#00a884]'
                    }`}>
                      {conversation.contact_name}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2 sm:ml-3 flex-shrink-0 font-semibold bg-gray-100 px-2 py-1 rounded-full">
                      {formatMessageTime(conversation.last_message_time)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <p className="text-xs sm:text-sm text-gray-600 truncate pr-2 sm:pr-3 leading-relaxed font-medium">
                      {conversation.last_message || 'Start a new conversation...'}
                    </p>
                    {conversation.unread_count > 0 && (
                      <span className="bg-gradient-to-r from-[#00a884] to-[#128c7e] text-white text-xs rounded-xl sm:rounded-2xl px-2 sm:px-3 py-1 sm:py-2 min-w-[24px] sm:min-w-[28px] h-6 sm:h-7 flex items-center justify-center font-bold shadow-xl transform transition-all duration-300 hover:scale-110 animate-pulse">
                        {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

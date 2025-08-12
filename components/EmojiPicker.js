'use client';

import { useState } from 'react';

const emojiCategories = {
  'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😶‍🌫️', '😏', '😒', '🙄', '😬', '😮‍💨', '🤥', '😌', '😔', '😪', '🤤', '😴'],
  'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
  'Gestures': ['👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
  'Objects': ['💬', '💭', '💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💣', '💤', '📱', '📞', '☎️', '📧', '💌', '📩', '📤', '📥', '📮', '🗳️', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝']
};

export default function EmojiPicker({ onEmojiSelect, isOpen, onClose }) {
  const [activeCategory, setActiveCategory] = useState('Smileys');

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-full right-0 mb-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#00a884]/5 to-[#128c7e]/5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Choose an emoji</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex border-b border-gray-100 bg-gray-50">
        {Object.keys(emojiCategories).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
              activeCategory === category
                ? 'text-[#00a884] border-b-2 border-[#00a884] bg-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Emoji Grid */}
      <div className="p-4 h-64 overflow-y-auto">
        <div className="grid grid-cols-8 gap-2">
          {emojiCategories[activeCategory].map((emoji, index) => (
            <button
              key={index}
              onClick={() => {
                onEmojiSelect(emoji);
                onClose();
              }}
              className="text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors hover:scale-110 transform duration-200"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

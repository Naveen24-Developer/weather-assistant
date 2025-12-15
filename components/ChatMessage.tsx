import React from 'react';
import { Message } from '../types';
import { Bot, User } from 'lucide-react';
import WeatherCard from './WeatherCard';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
          isUser ? 'bg-indigo-500 text-white' : 'bg-white text-sky-500 border border-sky-100'
        }`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Message Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
            <div
            className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                isUser 
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-none' 
                : 'bg-white text-gray-700 border border-sky-50 rounded-bl-none'
            }`}
            >
            {message.content}
            </div>
            
            {/* Embedded Weather Card if available */}
            {message.weatherData && (
                <WeatherCard data={message.weatherData} />
            )}
            
            {/* Timestamp */}
            <span className="text-[10px] text-gray-400 mt-1 px-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

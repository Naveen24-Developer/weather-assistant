
import React from 'react';
import { Message } from '@/lib/types';
import { Bot, User, CheckCircle2, XCircle } from 'lucide-react';
import WeatherCard from '../components/WeatherCard';

interface ChatMessageProps {
  message: Message;
  onConfirmTool?: (messageId: string) => void;
  onCancelTool?: (messageId: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onConfirmTool, onCancelTool }) => {
  const isUser = message.role === 'user';
  const isToolConfirmation = message.isToolConfirmation;

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
                : isToolConfirmation
                    ? 'bg-sky-50 border border-sky-200 rounded-bl-none'
                    : 'bg-white text-gray-700 border border-sky-50 rounded-bl-none'
            }`}
            >
            {message.content}
            </div>
            
            {/* Tool Confirmation UI */}
            {isToolConfirmation && onConfirmTool && onCancelTool && (
                <div className="mt-2 flex gap-2 animate-fade-in-up">
                    <button 
                        onClick={() => onConfirmTool(message.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
                    >
                        <CheckCircle2 size={14} />
                        Yes, show weather
                    </button>
                    <button 
                        onClick={() => onCancelTool(message.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded-lg transition-colors shadow-sm"
                    >
                        <XCircle size={14} />
                        No
                    </button>
                </div>
            )}

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

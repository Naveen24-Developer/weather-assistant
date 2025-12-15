import React, { useState, useRef, useEffect } from 'react';
import { Send, CloudSun, Loader2 } from 'lucide-react';
import { Message, WeatherData } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import ChatMessage from './ChatMessage';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "Hello! I'm SkyCast, your friendly weather assistant. 🌤️\nAsk me about the weather anywhere in the world!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Placeholder for AI message
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessagePlaceholder: Message = {
      id: aiMessageId,
      role: 'model',
      content: '', // Will be filled by stream
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, aiMessagePlaceholder]);

    let weatherDataBuffer: WeatherData | undefined = undefined;

    await sendMessageToGemini(
      userMessage.content,
      (chunkText, done) => {
        setMessages((prev) => {
          const newMessages = [...prev];
          const msgIndex = newMessages.findIndex((m) => m.id === aiMessageId);
          if (msgIndex !== -1) {
             const updatedMsg = { ...newMessages[msgIndex] };
             updatedMsg.content = updatedMsg.content + chunkText;
             
             // If we have buffered weather data and it's not attached yet, attach it
             if (weatherDataBuffer && !updatedMsg.weatherData) {
                 updatedMsg.weatherData = weatherDataBuffer;
             }

             if (done) {
               updatedMsg.isStreaming = false;
             }
             newMessages[msgIndex] = updatedMsg;
          }
          return newMessages;
        });
        
        if (done) {
            setIsLoading(false);
        }
      },
      (data) => {
          // Callback when weather data is fetched
          weatherDataBuffer = data;
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden relative">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md p-4 flex items-center border-b border-sky-100 z-10 sticky top-0">
        <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mr-3">
            <CloudSun className="text-white w-6 h-6" />
        </div>
        <div>
            <h1 className="font-bold text-gray-800 text-lg">SkyCast AI</h1>
            <p className="text-xs text-sky-600 font-medium flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                Online & Ready
            </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-gradient-to-b from-transparent to-white/30">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && messages[messages.length - 1]?.role !== 'model' && (
             <div className="flex justify-start">
                 <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-sky-50 flex items-center gap-1">
                    <div className="w-2 h-2 bg-sky-400 rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-sky-400 rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-sky-400 rounded-full typing-dot"></div>
                 </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/80 border-t border-sky-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the weather..."
            className="w-full pl-4 pr-12 py-3.5 bg-sky-50/50 border border-sky-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-200 focus:bg-white transition-all placeholder:text-gray-400 text-gray-700"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-2 p-2 rounded-lg transition-all duration-200 ${
              input.trim() && !isLoading
                ? 'bg-sky-500 text-white hover:bg-sky-600 shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-2">
            Powered by Gemini & WeatherAPI
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;

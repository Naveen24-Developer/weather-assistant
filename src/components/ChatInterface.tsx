'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, CloudSun, Loader2 } from 'lucide-react';

import type { Message, WeatherData } from '@/lib/types';
import { sendUserMessage, sendToolResponse } from '@/lib/geminiService';
import { getWeather } from '@/lib/weatherService';
import ChatMessage from '../components/ChatMessage';

/** Safe unique ID generator */
const generateId = () => crypto.randomUUID();

const ChatInterface: React.FC = () => {
  /** CHAT STATE */
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: 'model',
      content:
        "Hello! I'm SkyCast, your friendly weather assistant. 🌤️\nAsk me about the weather anywhere in the world!",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isWaitingForToolConfirm, setIsWaitingForToolConfirm] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  /** AUTO SCROLL */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  /** STREAM TEXT HANDLER */
  const handleStreamUpdate = (
    chunkText: string,
    done: boolean,
    messageId: string
  ) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? {
              ...msg,
              content: msg.content + chunkText,
              isStreaming: !done,
            }
          : msg
      )
    );

    if (done) setIsStreaming(false);
  };

  /** SEND USER MESSAGE */
  const handleSend = async () => {
    if (!input.trim() || isStreaming || isWaitingForToolConfirm) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);

    /** Placeholder AI message for streaming */
    const aiMessageId = generateId();

    setMessages(prev => [
      ...prev,
      {
        id: aiMessageId,
        role: 'model',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      },
    ]);

    await sendUserMessage(
      userMessage.content,

      /** STREAM CALLBACK */
      (text, done) => handleStreamUpdate(text, done, aiMessageId),

      /** TOOL CALL DETECTED */
      toolCall => {
        // Remove empty streaming placeholder
        setMessages(prev => prev.filter(m => m.id !== aiMessageId));

        setIsStreaming(false);
        setIsWaitingForToolConfirm(true);

        const location =
  typeof toolCall.args === 'object' && toolCall.args !== null
    ? (toolCall.args as any).location ?? 'the requested location'
    : 'the requested location';


        const confirmationMessage: Message = {
          id: generateId(),
          role: 'model',
          content: `Do you want me to show the weather data for **${location}**?`,
          timestamp: new Date(),
          isToolConfirmation: true,
          toolCallRequest: {
            id: toolCall.id || '',
            name: toolCall.name || '',
            args: toolCall.args,
          },
        };

        setMessages(prev => [...prev, confirmationMessage]);
      }
    );
  };

  /** CONFIRM TOOL EXECUTION */
  const handleConfirmTool = async (messageId: string) => {
    const msg = messages.find(m => m.id === messageId);
    if (!msg?.toolCallRequest) return;

    const { id, name, args } = msg.toolCallRequest;
    const location = args?.location ?? '';

    setIsWaitingForToolConfirm(false);
    setIsStreaming(true);

    /** Update confirmation message */
    setMessages(prev =>
      prev.map(m =>
        m.id === messageId
          ? {
              ...m,
              isToolConfirmation: false,
              content: `🔍 Fetching weather for **${location}**...`,
            }
          : m
      )
    );

    let weatherData: WeatherData | null = null;

    try {
      weatherData = await getWeather(location);
    } catch (error) {
      console.error('Weather fetch failed:', error);
    }

    const finalMessageId = generateId();

    /** Final AI message (with optional weather card) */
    setMessages(prev => [
      ...prev,
      {
        id: finalMessageId,
        role: 'model',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
        weatherData: weatherData || undefined,
      },
    ]);

    await sendToolResponse(
      id,
      name,
      weatherData
        ? { weather: weatherData }
        : { error: 'Unable to fetch weather data' },

      (text, done) =>
        handleStreamUpdate(text, done, finalMessageId),

      () => setIsStreaming(false)
    );
  };

  /** CANCEL TOOL */
  const handleCancelTool = async (messageId: string) => {
    const msg = messages.find(m => m.id === messageId);
    if (!msg?.toolCallRequest) return;

    const { id, name } = msg.toolCallRequest;

    setIsWaitingForToolConfirm(false);
    setIsStreaming(true);

    setMessages(prev =>
      prev.map(m =>
        m.id === messageId
          ? {
              ...m,
              isToolConfirmation: false,
              content: '❌ Request cancelled.',
            }
          : m
      )
    );

    const cancelMessageId = generateId();

    setMessages(prev => [
      ...prev,
      {
        id: cancelMessageId,
        role: 'model',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      },
    ]);

    await sendToolResponse(
      id,
      name,
      { error: 'User cancelled the request' },
      (text, done) =>
        handleStreamUpdate(text, done, cancelMessageId),
      () => setIsStreaming(false)
    );
  };

  /** ENTER KEY HANDLER */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl border overflow-hidden">

      {/* HEADER */}
      <div className="p-4 bg-white/80 border-b flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center">
          <CloudSun className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-gray-800">SkyCast AI</h1>
          <p className="text-xs text-sky-600">Online & Ready</p>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onConfirmTool={handleConfirmTool}
            onCancelTool={handleCancelTool}
          />
        ))}

        {isStreaming && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-2 rounded-xl shadow flex gap-1">
              <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce delay-150" />
              <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce delay-300" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 bg-white/80 border-t">
        <div className="relative flex items-center">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming || isWaitingForToolConfirm}
            placeholder="Ask about the weather..."
            className="w-full pl-4 pr-12 py-3 rounded-xl border focus:ring-2 focus:ring-sky-300"
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming || isWaitingForToolConfirm}
            className="absolute right-2 p-2 bg-sky-500 text-white rounded-lg disabled:opacity-50"
          >
            {isStreaming ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

// lib/types.ts

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;

  // Streaming support
  isStreaming?: boolean;

  // Weather card attachment
  weatherData?: WeatherData;

  // Tool confirmation flow
  isToolConfirmation?: boolean;
  toolCallRequest?: ToolCallRequest;
}

export interface ToolCallRequest {
  id: string;
  name: string;
  args?: {
    location?: string;
    [key: string]: any;
  };
}

export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
    humidity: number;
    feelslike_c: number;
    uv: number;
  };
}

/**
 * Centralized chat state (optional usage)
 * Matches the new ChatInterface logic
 */
export interface ChatState {
  messages: Message[];
  isStreaming: boolean;
  isWaitingForToolConfirm: boolean;
}

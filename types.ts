export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  weatherData?: WeatherData; // Optional attachment if the message contains weather info
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

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

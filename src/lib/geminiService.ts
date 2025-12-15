import { GoogleGenAI, Chat, FunctionDeclaration, Type, Tool, FunctionCall } from "@google/genai";
import { getWeather } from "./weatherService";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

// Define the tool
const weatherTool: FunctionDeclaration = {
  name: "get_current_weather",
  description: "Get the current weather for a specific location. Always use this tool when the user asks about weather.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      location: {
        type: Type.STRING,
        description: "The city and country, e.g. London, UK or Tokyo, JP",
      },
    },
    required: ["location"],
  },
};

const tools: Tool[] = [{ functionDeclarations: [weatherTool] }];

const systemInstruction = `
You are SkyCast, a specialized, friendly, and professional weather AI assistant.
Your goal is to provide accurate weather information using the available tools.

RULES:
1. GREETINGS: If the user says "hi", "hello", or similar greetings, reply warmly and introduce yourself as a weather assistant. Ask them where they would like to check the weather.
2. WEATHER ONLY: You are strictly limited to weather-related topics. 
   - If the user asks about the weather, ALWAYS use the 'get_current_weather' tool.
   - If the user asks a general question (e.g., "What is the capital of France?", "Write a poem"), politely REFUSE. 
   - Say something like: "I'm sorry, but I can only help with weather-related inquiries. Would you like to check the weather somewhere?"
3. PERSONALITY: Be polite, concise, and helpful. Use emojis occasionally to be friendly (e.g., 🌤️, 🌧️).
4. DATA PRESENTATION: When presenting weather data, make it easy to read. Mention the temperature, condition, and key details like humidity or wind.
5. REALTIME: Always fetch real-time data using the tool. Do not guess.
`;

let chatSession: Chat | null = null;

export const initializeChat = () => {
  chatSession = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction,
      tools,
      temperature: 0.7,
    },
  });
};

export type StreamCallback = (chunkText: string, done: boolean) => void;
export type WeatherCallback = (data: any) => void;

/**
 * Sends a message to Gemini and handles streaming response + function calling
 */
export const sendMessageToGemini = async (
  message: string,
  onStream: StreamCallback,
  onWeatherData?: WeatherCallback
) => {
  if (!chatSession) initializeChat();
  if (!chatSession) throw new Error("Failed to initialize chat session");

  try {
    // 1. Send the user's message
    const result = await chatSession.sendMessageStream({ message });

    let functionCallFound: FunctionCall | null = null;

    // 2. Process initial stream
    for await (const chunk of result) {
        const text = chunk.text;
        if (text) {
            onStream(text, false);
        }

        const fc = chunk.functionCalls;
        if (fc && fc.length > 0) {
            functionCallFound = fc[0];
            break; 
        }
    }

    // 3. If a function call was requested
    if (functionCallFound) {
       const { name, args, id } = functionCallFound;
       
       if (name === "get_current_weather") {
           const location = (args as any)?.location || "unknown";
           
           // Fetch weather data
           const weatherData = await getWeather(location);
           
           if (onWeatherData && weatherData) {
               onWeatherData(weatherData);
           }

           const toolResult = weatherData 
            ? { weather: weatherData } 
            : { error: "Could not fetch weather for this location. Please check the city name and try again." };

           // 4. Send the tool result back to the model
           // IMPORTANT: We must include the 'id' so the model matches the response to the call
           const toolResponseResult = await chatSession.sendMessageStream({
               message: [{
                   functionResponse: {
                       id: id, 
                       name: name,
                       response: toolResult 
                   }
               }]
           });

           // 5. Stream the final answer
           for await (const chunk of toolResponseResult) {
               const text = chunk.text;
               if (text) {
                   onStream(text, false);
               }
           }
       } else {
         console.warn(`Unknown tool called: ${name}`);
       }
    }

    onStream("", true); // Done

  } catch (error) {
    console.error("Gemini Error:", error);
    // Reset session so next try gets a fresh state and doesn't get stuck in a 'function call' pending state
    chatSession = null;
    onStream("\n[System]: Sorry, I encountered an error. Please try again.", true);
  }
};
